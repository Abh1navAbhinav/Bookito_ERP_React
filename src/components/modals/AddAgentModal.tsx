import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Modal, FormField, Input, Select, Button } from '@/components/FormElements'
import type { TravelAgent } from '@/lib/partnersApi'
import { cn } from '@/lib/utils'

interface AddAgentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (agent: Partial<TravelAgent>) => void
  initialData?: Partial<TravelAgent>
  /** Form keys that cannot be edited (e.g. trade-fair lead fields) */
  lockedFields?: string[]
  title?: string
}

export const AddAgentModal: React.FC<AddAgentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  lockedFields: lockedFieldsProp,
  title = "Add Travel Agent"
}) => {
  const lockedFields = useMemo(() => new Set(lockedFieldsProp ?? []), [lockedFieldsProp])
  const isFieldLocked = useCallback((field: string) => lockedFields.has(field), [lockedFields])

  const emptyForm = {
    agentName: '',
    contactNumber: '',
    email: '',
    location: '',
    contractType: 'Bronze' as TravelAgent['contractType'],
    planStartDate: '',
    planEndDate: '',
  }

  const [form, setForm] = useState({
    ...emptyForm,
    ...initialData
  })

  useEffect(() => {
    if (isOpen && initialData) {
      setForm(prev => ({
        ...prev,
        ...initialData
      }))
    }
  }, [isOpen, initialData])

  const handleSave = () => {
    if (!form.agentName?.trim()) return
    onSave(form)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
    >
      <div className="space-y-4">
        <FormField label="Agent Name">
          <Input
            value={form.agentName}
            onChange={(e) => setForm((p) => ({ ...p, agentName: e.target.value }))}
            placeholder="Enter agency name"
            disabled={isFieldLocked('agentName')}
            className={cn(
              isFieldLocked('agentName') &&
                'cursor-not-allowed bg-surface-50 text-surface-700 disabled:border-surface-200 disabled:opacity-100'
            )}
          />
        </FormField>
        <FormField label="Contact Number">
          <Input
            value={form.contactNumber}
            onChange={(e) => setForm((p) => ({ ...p, contactNumber: e.target.value }))}
            placeholder="+91 XXXXX XXXXX"
            disabled={isFieldLocked('contactNumber')}
            className={cn(
              isFieldLocked('contactNumber') &&
                'cursor-not-allowed bg-surface-50 text-surface-700 disabled:border-surface-200 disabled:opacity-100'
            )}
          />
        </FormField>
        <FormField label="Email">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="agent@email.com"
            disabled={isFieldLocked('email')}
            className={cn(
              isFieldLocked('email') &&
                'cursor-not-allowed bg-surface-50 text-surface-700 disabled:border-surface-200 disabled:opacity-100'
            )}
          />
        </FormField>
        <FormField label="Location">
          <Input
            value={form.location}
            onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
            placeholder="e.g. Chelode, Wayanad"
            disabled={isFieldLocked('location')}
            className={cn(
              isFieldLocked('location') &&
                'cursor-not-allowed bg-surface-50 text-surface-700 disabled:border-surface-200 disabled:opacity-100'
            )}
          />
        </FormField>
        <FormField label="Contract Type">
          <Select
            value={form.contractType}
            onChange={(value) =>
              setForm((p) => ({ ...p, contractType: value as TravelAgent['contractType'] }))
            }
            options={[
              { label: 'Platinum', value: 'Platinum' },
              { label: 'Gold', value: 'Gold' },
              { label: 'Silver', value: 'Silver' },
              { label: 'Bronze', value: 'Bronze' },
            ]}
            placeholder="Select contract"
          />
        </FormField>
        <FormField label="Plan Start Date">
          <Input
            type="date"
            value={form.planStartDate}
            onChange={(e) => setForm((p) => ({ ...p, planStartDate: e.target.value }))}
          />
        </FormField>
        <FormField label="Plan End Date">
          <Input
            type="date"
            value={form.planEndDate}
            onChange={(e) => setForm((p) => ({ ...p, planEndDate: e.target.value }))}
          />
        </FormField>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Agent
        </Button>
      </div>
    </Modal>
  )
}
