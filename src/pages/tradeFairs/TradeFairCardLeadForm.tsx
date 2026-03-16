import { useMemo, useState } from 'react'

type ExtractedLead = {
  name: string
  company: string
  email: string
  phone: string
  location: string
  designation: string
}

type Props = {
  fairName: string
  fairId: string | number
}

export function TradeFairCardLeadForm({ fairName, fairId }: Props) {
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [extracted, setExtracted] = useState<ExtractedLead | null>(null)

  const isMobileLike = useMemo(
    () => /Mobi|Android/i.test(window.navigator.userAgent),
    []
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!frontFile) {
      setError('Please add at least the front side of the card.')
      return
    }

    try {
      setIsSubmitting(true)

      const apiKey = import.meta.env.VITE_OCRSPACE_API_KEY as string | undefined
      if (!apiKey) {
        throw new Error('OCR API key is missing. Please set VITE_OCRSPACE_API_KEY in your env.')
      }

      // Helper to call OCR.space for a single image
      const callOcr = async (file: File): Promise<string> => {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('apikey', apiKey)
        fd.append('language', 'eng')
        fd.append('OCREngine', '2')

        const res = await fetch('https://api.ocr.space/parse/image', {
          method: 'POST',
          body: fd,
        })

        if (!res.ok) {
          throw new Error('OCR request failed')
        }

        const json = await res.json()
        const parsedText: string | undefined = json?.ParsedResults?.[0]?.ParsedText
        return parsedText ?? ''
      }

      let combinedText = await callOcr(frontFile)
      if (backFile) {
        const backText = await callOcr(backFile)
        combinedText = `${combinedText}\n${backText}`
      }

      const mapped = extractLeadFromText(combinedText)
      setExtracted(mapped)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong while reading the card.'
      console.error(err)
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSave = () => {
    if (!extracted) return

    console.log('New trade fair lead', {
      ...extracted,
      sourceType: 'trade_fair',
      sourceFairId: fairId,
      sourceFairName: fairName,
    })

    alert('Lead data captured (frontend only for now). When backend is ready, this can be saved.')
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-surface-700">Front side of card</label>
          <input
            type="file"
            accept="image/*"
            capture={isMobileLike ? 'environment' : undefined}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              setFrontFile(file)
            }}
            className="block w-full cursor-pointer text-xs text-surface-600 file:mr-2 file:rounded-md file:border-none file:bg-primary-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-primary-700"
          />
          {frontFile && (
            <p className="text-[11px] text-surface-500">Selected: {frontFile.name}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-surface-700">
            Back side of card (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            capture={isMobileLike ? 'environment' : undefined}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              setBackFile(file)
            }}
            className="block w-full cursor-pointer text-xs text-surface-600 file:mr-2 file:rounded-md file:border-none file:bg-primary-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-primary-700"
          />
          {backFile && (
            <p className="text-[11px] text-surface-500">Selected: {backFile.name}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Reading card…' : 'Extract details from card'}
      </button>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {extracted && (
        <div className="mt-4 grid gap-3 rounded-md border border-surface-200 bg-surface-50 p-3 text-xs">
          <p className="font-semibold text-surface-800">Review and adjust details</p>

          <div className="grid gap-2 md:grid-cols-2">
            <LabeledInput
              label="Name"
              value={extracted.name}
              onChange={(v) => setExtracted((prev) => (prev ? { ...prev, name: v } : prev))}
            />
            <LabeledInput
              label="Company"
              value={extracted.company}
              onChange={(v) => setExtracted((prev) => (prev ? { ...prev, company: v } : prev))}
            />
            <LabeledInput
              label="Email"
              value={extracted.email}
              onChange={(v) => setExtracted((prev) => (prev ? { ...prev, email: v } : prev))}
            />
            <LabeledInput
              label="Phone"
              value={extracted.phone}
              onChange={(v) => setExtracted((prev) => (prev ? { ...prev, phone: v } : prev))}
            />
            <LabeledInput
              label="Location"
              value={extracted.location}
              onChange={(v) => setExtracted((prev) => (prev ? { ...prev, location: v } : prev))}
            />
            <LabeledInput
              label="Designation"
              value={extracted.designation}
              onChange={(v) =>
                setExtracted((prev) => (prev ? { ...prev, designation: v } : prev))
              }
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="mt-2 inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
          >
            Save lead (for now just log)
          </button>
        </div>
      )}
    </form>
  )
}

type LabeledInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

function LabeledInput({ label, value, onChange }: LabeledInputProps) {
  return (
    <div className="space-y-0.5">
      <label className="text-[11px] font-medium text-surface-600">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-surface-200 bg-white px-2 py-1 text-xs text-surface-800 outline-none ring-0 focus:border-primary-400 focus:ring-1 focus:ring-primary-200"
      />
    </div>
  )
}

function extractLeadFromText(text: string): ExtractedLead {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
  const phoneMatch = text.match(/(\+?\d[\d\s\-().]{6,})/)

  const email = emailMatch?.[0] ?? ''
  const phone = phoneMatch?.[0] ?? ''

  const name = lines[0] ?? ''
  const company = lines[1] ?? ''
  const location = lines[lines.length - 1] ?? ''

  return {
    name,
    company,
    email,
    phone,
    location,
    designation: '',
  }
}


