import React, { useState, useEffect } from 'react'
import { Modal, FormField, Input, Select, Button } from '@/components/FormElements'
import { type TravelAgent } from '@/data/mockData'

interface AddAgentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (agent: Partial<TravelAgent>) => void
  initialData?: Partial<TravelAgent>
  title?: string
}

export const AddAgentModal: React.FC<AddAgentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  title = "Add Travel Agent"
}) => {
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
          />
        </FormField>
        <FormField label="Contact Number">
          <Input
            value={form.contactNumber}
            onChange={(e) => setForm((p) => ({ ...p, contactNumber: e.target.value }))}
            placeholder="+91 XXXXX XXXXX"
          />
        </FormField>
        <FormField label="Email">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="agent@email.com"
          />
        </FormField>
        <FormField label="Location">
          <Input
            value={form.location}
            onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
            placeholder="e.g. Chelode, Wayanad"
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
