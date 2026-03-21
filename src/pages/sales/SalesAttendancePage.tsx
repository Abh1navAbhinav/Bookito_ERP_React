import { useState, useEffect, useCallback } from 'react'
import { Camera, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/FormElements'
import { SelfieCaptureModal } from '@/components/modals/SelfieCaptureModal'
import {
  fetchSalesAttendanceForDate,
  salesCheckIn,
  salesCheckOut,
  type SalesAttendanceRecord,
} from '@/lib/salesApi'

interface AttendanceEntry {
  id: string
  employeeName: string
  date: string
  status: 'present' | 'absent' | 'on_leave'
  checkIn?: string
  checkOut?: string
  checkInSelfie?: string
  checkOutSelfie?: string
  checkInLocation?: { lat: number; lng: number; name?: string } | null
  checkOutLocation?: { lat: number; lng: number; name?: string } | null
}

function mapApiToEntry(r: SalesAttendanceRecord): AttendanceEntry {
  return {
    id: r.id,
    employeeName: r.user_name,
    date: r.date,
    status: 'present',
    checkIn: r.check_in_time ?? undefined,
    checkOut: r.check_out_time ?? undefined,
    checkInSelfie: r.check_in_selfie || undefined,
    checkOutSelfie: r.check_out_selfie || undefined,
    checkInLocation: r.check_in_location ?? undefined,
    checkOutLocation: r.check_out_location ?? undefined,
  }
}

export default function SalesAttendancePage() {
  const [currentUser, setCurrentUser] = useState<{ role: string; label: string } | null>(null)
  const [showSelfieModal, setShowSelfieModal] = useState(false)
  const [captureType, setCaptureType] = useState<'in' | 'out'>('in')
  const [todayRecord, setTodayRecord] = useState<AttendanceEntry | null>(null)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const loadToday = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const raw = window.localStorage.getItem('bookito_demo_user')
      if (raw) setCurrentUser(JSON.parse(raw))
      const record = await fetchSalesAttendanceForDate(today)
      setTodayRecord(record ? mapApiToEntry(record) : null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load attendance')
      setTodayRecord(null)
    } finally {
      setLoading(false)
    }
  }, [today])

  useEffect(() => {
    loadToday()
  }, [loadToday])

  const handleCapture = async ({
    image,
    location,
  }: {
    image: string
    location: { lat: number; lng: number; name?: string } | null
  }) => {
    if (!currentUser) return

    const now = new Date()
    const nowTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`
    const locPayload = location
      ? { lat: location.lat, lng: location.lng, ...(location.name ? { name: location.name } : {}) }
      : null
    setSaving(true)
    setError(null)
    try {
      if (captureType === 'in') {
        const created = await salesCheckIn(today, nowTime, {
          check_in_selfie: image,
          check_in_location: locPayload,
        })
        setTodayRecord(mapApiToEntry(created))
      } else {
        if (!todayRecord?.id) return
        const updated = await salesCheckOut(todayRecord.id, nowTime, {
          check_out_selfie: image,
          check_out_location: locPayload,
        })
        setTodayRecord(mapApiToEntry(updated))
      }
      setMessage({
        text: `Successfully marked ${captureType === 'in' ? 'Check-In' : 'Check-Out'} at ${nowTime}`,
        type: 'success',
      })
      setShowSelfieModal(false)
    } catch (e) {
      console.error('Error saving attendance:', e)
      setError(e instanceof Error ? e.message : 'Failed to save attendance')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Daily Attendance</h1>
          <p className="text-surface-500 mt-2">Mark your daily check-in and check-out with uniform verification.</p>
        </div>
        <div className="rounded-2xl border-2 border-surface-200 bg-surface-50 p-12 text-center text-surface-500">
          Loading today’s attendance…
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Daily Attendance</h1>
        <p className="text-surface-500 mt-2">Mark your daily check-in and check-out with uniform verification.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 flex items-center gap-3">
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Punch In Card */}
        <div className={`rounded-2xl border-2 p-8 transition-all ${
          todayRecord?.checkIn 
            ? 'border-emerald-100 bg-emerald-50/30' 
            : 'border-surface-200 bg-white hover:border-primary-300'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className={`p-3 rounded-xl ${todayRecord?.checkIn ? 'bg-emerald-100 text-emerald-600' : 'bg-primary-50 text-primary-600'}`}>
              <Clock className="h-6 w-6" />
            </div>
            {todayRecord?.checkIn && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4" /> Completed
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-surface-900 mb-2">Shift Check-In</h3>
          <p className="text-sm text-surface-500 mb-8 leading-relaxed">
            Mark your arrival at work. Requires official uniform selfie verification for shift compliance.
          </p>

          {todayRecord?.checkIn ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-emerald-100 shadow-sm">
                <span className="text-sm font-medium text-surface-600">Logged at</span>
                <span className="text-lg font-bold text-emerald-700">{todayRecord.checkIn}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Uniform verified successfully</span>
              </div>
            </div>
          ) : (
            <Button 
              className="w-full h-12 text-base shadow-lg shadow-primary-500/10" 
              disabled={saving}
              onClick={() => {
                setCaptureType('in')
                setShowSelfieModal(true)
              }}
            >
              <Camera className="mr-2 h-5 w-5" />
              {saving ? 'Saving…' : 'Punch In Now'}
            </Button>
          )}
        </div>

        {/* Punch Out Card */}
        <div className={`rounded-2xl border-2 p-8 transition-all ${
          todayRecord?.checkOut 
            ? 'border-amber-100 bg-amber-50/30' 
            : todayRecord?.checkIn 
              ? 'border-surface-200 bg-white hover:border-amber-300'
              : 'border-surface-100 bg-surface-50 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className={`p-3 rounded-xl ${todayRecord?.checkOut ? 'bg-amber-100 text-amber-600' : 'bg-surface-200 text-surface-400'}`}>
              <Clock className="h-6 w-6 transform rotate-180" />
            </div>
            {todayRecord?.checkOut && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4" /> Completed
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-surface-900 mb-2">Shift Check-Out</h3>
          <p className="text-sm text-surface-500 mb-8 leading-relaxed">
            Mark your departure. Ensure your daily reports are submitted before punching out.
          </p>

          {todayRecord?.checkOut ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-amber-100 shadow-sm">
                <span className="text-sm font-medium text-surface-600">Logged at</span>
                <span className="text-lg font-bold text-amber-700">{todayRecord.checkOut}</span>
              </div>
            </div>
          ) : (
            <Button 
              variant="secondary"
              disabled={!todayRecord?.checkIn || saving}
              className="w-full h-12 text-base" 
              onClick={() => {
                setCaptureType('out')
                setShowSelfieModal(true)
              }}
            >
              <Camera className="mr-2 h-5 w-5" />
              {saving ? 'Saving…' : 'Punch Out Now'}
            </Button>
          )}
        </div>
      </div>

      {message && (
        <div className={`mt-8 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-bottom-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-primary-50 text-primary-700 border border-primary-200'
        }`}>
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold">{message.text}</p>
        </div>
      )}

      <SelfieCaptureModal
        isOpen={showSelfieModal}
        onClose={() => setShowSelfieModal(false)}
        onCapture={handleCapture}
        title={captureType === 'in' ? 'Check-In Verification' : 'Check-Out Verification'}
        subtitle={`Please take a selfie wearing your official uniform to mark your ${captureType === 'in' ? 'check-in' : 'check-out'}.`}
      />
    </div>
  )
}
