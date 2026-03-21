import React, { useRef, useState, useEffect } from 'react'
import { Camera, MapPin, CheckCircle2, X } from 'lucide-react'
import { Button } from '@/components/FormElements'

interface SelfieCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (data: { image: string; location: { lat: number; lng: number; name?: string } | null }) => void
  title: string
  subtitle: string
}

export function SelfieCaptureModal({
  isOpen,
  onClose,
  onCapture,
  title,
  subtitle,
}: SelfieCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number; name?: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null)
      setError(null)
      startCamera()
      fetchLocation()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [isOpen])

  const startCamera = async (retryCount = 0) => {
    setError(null)
    stopCamera()

    // Safety check for browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera API is not supported in this browser or context (requires HTTPS).')
      return
    }

    // Small delay to ensure the video element is mounted and ref is ready
    if (!videoRef.current && retryCount < 3) {
      setTimeout(() => startCamera(retryCount + 1), 100)
      return
    }

    try {
      console.log('Attempting to start camera...')
      
      // Attempt with a variety of common constraints
      const constraints = [
        { video: { facingMode: 'user' } },
        { video: true },
        { video: { width: { ideal: 640 }, height: { ideal: 480 } } }
      ]

      let stream: MediaStream | null = null
      let lastErr: any = null

      for (const group of constraints) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(group)
          if (stream) break
        } catch (e) {
          lastErr = e
        }
      }

      if (!stream) {
        throw lastErr || new Error('Failed to get media stream with any constraints')
      }

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Force play just in case autoPlay is inhibited
        try {
          await videoRef.current.play()
        } catch (playErr) {
          console.warn('Auto-play was inhibited, checking if muted helps...')
        }
      }
    } catch (err: any) {
      console.error('Final error accessing camera:', err)
      
      let msg = 'Could not access camera. '
      if (err.name === 'NotAllowedError') msg += 'Permission denied by browser.'
      else if (err.name === 'NotFoundError') msg += 'No camera device found.'
      else if (err.name === 'NotReadableError') msg += 'Camera is already in use by another app.'
      else msg += `Error: ${err.message || 'Unknown error'}`
      
      setError(msg)
    }
  }

  const stopCamera = () => {
    const fromRef = streamRef.current
    const fromVideo =
      videoRef.current?.srcObject instanceof MediaStream
        ? (videoRef.current.srcObject as MediaStream)
        : null
    const stream = fromRef ?? fromVideo
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const fetchLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          let name = undefined

          try {
            // Reverse Geocoding via Nominatim
            // IMPORTANT: Nominatim requires a User-Agent to avoid being blocked
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
              { 
                headers: { 
                  'Accept-Language': 'en',
                  'User-Agent': 'BookitoERPAttendance/1.0'
                } 
              }
            )
            const data = await response.json()
            
            // We want a clean, human-readable address like: Road, City, State
            const addr = data.address
            const parts = [
              addr.road || addr.street || addr.village || addr.suburb,
              addr.town || addr.city || addr.district,
              addr.state
            ].filter(Boolean)
            
            name = parts.join(', ') || data.display_name || 'Attendance Verified'
          } catch (err) {
            console.warn('Reverse geocoding failed:', err)
          }

          setLocation({ lat, lng, name })
        },
        (err) => {
          console.error('Error fetching location:', err)
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      )
    }
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL('image/jpeg')
        setCapturedImage(dataUrl)
        stopCamera()
      }
    }
  }

  const handleConfirm = () => {
    if (capturedImage) {
      setIsCapturing(true)
      // Simulate "uploading"
      setTimeout(() => {
        onCapture({ image: capturedImage, location })
        setIsCapturing(false)
        onClose()
      }, 1000)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-surface-200 animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Camera className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-primary-100/80">{subtitle}</p>
        </div>

        <div className="p-6">
          {error ? (
            <div className="space-y-4 rounded-xl bg-red-50 p-4 text-center">
              <div className="flex flex-col items-center gap-1">
                <p className="text-sm font-bold text-red-600">Hardware Issue Detected</p>
                <p className="text-xs text-red-500/80">{error}</p>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full bg-white border-red-200 text-red-700 hover:bg-red-50"
                  onClick={() => { setError(null); startCamera(); }}
                >
                  Retry Camera Access
                </Button>
                
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-red-200"></span></div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-red-50 px-2 text-red-400 font-bold">OR</span></div>
                </div>

                <Button 
                  variant="secondary"
                  size="sm"
                  className="w-full bg-surface-900 text-white hover:bg-surface-800 border-none shadow-md"
                  onClick={() => {
                    // Simulate a capture with a high-quality placeholder for demo purposes
                    const mockSelfie = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop'
                    setCapturedImage(mockSelfie)
                    setLocation({
                      lat: 11.6624,
                      lng: 76.2598,
                      name: 'Police Station Road, Sulthan Bathery, Wayanad, Kerala'
                    })
                    setError(null)
                  }}
                >
                  Simulate Capture (Dev/Demo Mode)
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview Area */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-100 ring-1 ring-surface-200 shadow-inner">
                {!capturedImage ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                ) : (
                  <img
                    src={capturedImage}
                    alt="Captured selfie"
                    className="h-full w-full object-cover"
                  />
                )}
                
                {/* Visual Indicators */}
                {!capturedImage && (
                   <div className="absolute inset-0 pointer-events-none border-[3px] border-dashed border-white/40 rounded-2xl m-6"></div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                {!capturedImage ? (
                  <Button
                    onClick={handleCapture}
                    className="w-full py-6 text-lg font-bold shadow-lg shadow-primary-500/20"
                  >
                    Take Selfie
                  </Button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setCapturedImage(null)
                        startCamera()
                      }}
                      className="w-full"
                    >
                      Retake
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      className="w-full font-bold shadow-lg shadow-primary-500/20"
                      disabled={isCapturing}
                    >
                      {isCapturing ? 'Saving...' : 'Confirm'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hidden Canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Compliance Notice */}
          <div className="mt-6 flex items-start gap-2 rounded-xl bg-surface-50 p-3 text-[11px] text-surface-500 border border-surface-100">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            <p>
              By proceeding, you verify that you are wearing the company uniform as per policy. 
              Timestamp and session details will be logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
