import React, { useState } from 'react'
import { Modal, FormField, Input, Select, Textarea, Button } from '@/components/FormElements'
import { 
  propertyTypes, 
  propertyClasses, 
  roomCategories, 
  tenureOptions, 
  planTypeOptions, 
  primaryContactOptions, 
  firstVisitStatusOptions, 
  visitStatusOptions,
  type Property
} from '@/data/mockData'

interface AddPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (property: Partial<Property>) => void
  initialData?: Partial<Property>
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}) => {
  const emptyForm = {
    name: '',
    propertyType: '',
    propertyClass: '',
    roomCategory: '',
    numberOfRooms: '',
    location: '',
    hasMultipleProperty: false,
    numberOfProperties: '',
    place: '',
    email: '',
    proposedPrice: '',
    finalCommittedPrice: '',
    tenure: '',
    planType: '',
    primaryContactPerson: '',
    contactPersonName: '',
    contactNumber: '',
    primaryPersonPosition: '',
    executiveName: '',
    firstVisitDate: '',
    firstVisitStatus: '',
    committedProposedRate: '',
    secondVisitExecutive: '',
    secondVisitDate: '',
    secondVisitStatus: '',
    secondVisitComments: '',
    currentlyAssignedTo: '',
    closingAmount: '',
    planStartDate: '',
    planExpiryDate: '',
    locationLink: '',
    currentPMS: '',
    connectedOTAPlatforms: '',
    comments: '',
  }

  const [form, setForm] = useState({
    ...emptyForm,
    ...initialData,
    // Handle numeric or special cases from initialData if needed
    numberOfRooms: initialData?.numberOfRooms?.toString() || '',
    proposedPrice: initialData?.proposedPrice?.toString() || '',
    finalCommittedPrice: initialData?.finalCommittedPrice?.toString() || '',
    closingAmount: initialData?.closingAmount?.toString() || '',
    numberOfProperties: initialData?.numberOfProperties?.toString() || '',
  })

  // Update form if initialData changes (useful for pre-filling)
  React.useEffect(() => {
    if (isOpen && initialData) {
      setForm(prev => ({
        ...prev,
        ...initialData,
        numberOfRooms: initialData.numberOfRooms?.toString() || prev.numberOfRooms,
        proposedPrice: initialData.proposedPrice?.toString() || prev.proposedPrice,
        finalCommittedPrice: initialData.finalCommittedPrice?.toString() || prev.finalCommittedPrice,
        closingAmount: initialData.closingAmount?.toString() || prev.closingAmount,
        numberOfProperties: initialData.numberOfProperties?.toString() || prev.numberOfProperties,
      }))
    }
  }, [isOpen, initialData])

  const handleSave = () => {
    if (!form.name?.trim()) return
    onSave(form as any)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Property"
      size="xl"
    >
      <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-2">
        <FormField label="Property Name">
          <Input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Enter property name"
          />
        </FormField>
        <FormField label="Property Type">
          <Select
            value={form.propertyType}
            onChange={(value) => setForm((prev) => ({ ...prev, propertyType: value }))}
            options={propertyTypes.map((t) => ({ label: t, value: t }))}
            placeholder="Select type"
          />
        </FormField>
        <FormField label="Property Class">
          <Select
            value={form.propertyClass}
            onChange={(value) => setForm((prev) => ({ ...prev, propertyClass: value }))}
            options={propertyClasses.map((c) => ({ label: c, value: c }))}
            placeholder="Select class"
          />
        </FormField>
        <FormField label="Room Category">
          <Select
            value={form.roomCategory}
            onChange={(value) => setForm((prev) => ({ ...prev, roomCategory: value }))}
            options={roomCategories.map((r) => ({ label: r, value: r }))}
            placeholder="Select category"
          />
        </FormField>
        <FormField label="Number of Rooms">
          <Input
            type="number"
            value={form.numberOfRooms}
            onChange={(e) => setForm((prev) => ({ ...prev, numberOfRooms: e.target.value }))}
            placeholder="0"
          />
        </FormField>
        <FormField label="Property Location">
          <Input
            value={form.location}
            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
            placeholder="e.g. Forest Side, Mountain Side"
          />
        </FormField>
        <FormField label="Multiple Property">
          <Select
            value={form.hasMultipleProperty ? 'Yes' : 'No'}
            onChange={(value) => setForm((prev) => ({ ...prev, hasMultipleProperty: value === 'Yes' }))}
            options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]}
            placeholder="Select"
          />
        </FormField>
        {form.hasMultipleProperty && (
          <FormField label="No. of Properties">
            <Input
              type="number"
              value={form.numberOfProperties}
              onChange={(e) => setForm((prev) => ({ ...prev, numberOfProperties: e.target.value }))}
              placeholder="0"
            />
          </FormField>
        )}
        <FormField label="Property Place Name">
          <Input
            value={form.place}
            onChange={(e) => setForm((prev) => ({ ...prev, place: e.target.value }))}
            placeholder="e.g. Muthanga, Sulthan Bathery"
          />
        </FormField>
        <FormField label="Property Email ID">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="property@email.com"
          />
        </FormField>
        <FormField label="Proposed Price (INR)">
          <Input
            type="number"
            value={form.proposedPrice}
            onChange={(e) => setForm((prev) => ({ ...prev, proposedPrice: e.target.value }))}
            placeholder="0"
          />
        </FormField>
        <FormField label="Final Committed Price (INR)">
          <Input
            type="number"
            value={form.finalCommittedPrice}
            onChange={(e) => setForm((prev) => ({ ...prev, finalCommittedPrice: e.target.value }))}
            placeholder="0"
          />
        </FormField>
        <FormField label="Tenure / Plan Type">
          <Select
            value={form.tenure}
            onChange={(value) => setForm((prev) => ({ ...prev, tenure: value }))}
            options={tenureOptions.map((t) => ({ label: t, value: t }))}
            placeholder="Select tenure"
          />
        </FormField>
        <FormField label="Plan Type">
          <Select
            value={form.planType}
            onChange={(value) => setForm((prev) => ({ ...prev, planType: value }))}
            options={planTypeOptions.map((p) => ({ label: p, value: p }))}
            placeholder="Select plan"
          />
        </FormField>
        <FormField label="Primary Contact Person (Role)">
          <Select
            value={form.primaryContactPerson}
            onChange={(value) => setForm((prev) => ({ ...prev, primaryContactPerson: value }))}
            options={primaryContactOptions.map((p) => ({ label: p, value: p }))}
            placeholder="Select role"
          />
        </FormField>
        <FormField label="Contact Person Name">
          <Input
            value={form.contactPersonName}
            onChange={(e) => setForm((prev) => ({ ...prev, contactPersonName: e.target.value }))}
            placeholder="Enter name"
          />
        </FormField>
        <FormField label="Contact Number">
          <Input
            value={form.contactNumber}
            onChange={(e) => setForm((prev) => ({ ...prev, contactNumber: e.target.value }))}
            placeholder="+91 XXXXX XXXXX"
          />
        </FormField>
        <FormField label="Primary Person Position">
          <Input
            value={form.primaryPersonPosition}
            onChange={(e) => setForm((prev) => ({ ...prev, primaryPersonPosition: e.target.value }))}
            placeholder="e.g. Manager, Owner"
          />
        </FormField>
        <FormField label="Executive Name">
          <Input
            value={form.executiveName}
            onChange={(e) => setForm((prev) => ({ ...prev, executiveName: e.target.value }))}
            placeholder="First visit executive"
          />
        </FormField>
        <FormField label="First Visit Date">
          <Input
            type="date"
            value={form.firstVisitDate}
            onChange={(e) => setForm((prev) => ({ ...prev, firstVisitDate: e.target.value }))}
          />
        </FormField>
        <FormField label="First Visit Status">
          <Select
            value={form.firstVisitStatus}
            onChange={(value) => setForm((prev) => ({ ...prev, firstVisitStatus: value }))}
            options={firstVisitStatusOptions.map((s) => ({ label: s, value: s }))}
            placeholder="Select status"
          />
        </FormField>
        <FormField label="Committed / Proposed Rate">
          <Input
            value={form.committedProposedRate}
            onChange={(e) => setForm((prev) => ({ ...prev, committedProposedRate: e.target.value }))}
            placeholder="e.g. 100/250"
          />
        </FormField>
        <FormField label="Second Visit Executive">
          <Input
            value={form.secondVisitExecutive}
            onChange={(e) => setForm((prev) => ({ ...prev, secondVisitExecutive: e.target.value }))}
            placeholder="Name"
          />
        </FormField>
        <FormField label="Second Visit Date">
          <Input
            type="date"
            value={form.secondVisitDate}
            onChange={(e) => setForm((prev) => ({ ...prev, secondVisitDate: e.target.value }))}
          />
        </FormField>
        <FormField label="Status (Second Visit)">
          <Select
            value={form.secondVisitStatus}
            onChange={(value) => setForm((prev) => ({ ...prev, secondVisitStatus: value }))}
            options={visitStatusOptions.map((s) => ({ label: s, value: s }))}
            placeholder="Select status"
          />
        </FormField>
        <FormField label="Second Visit Comments">
          <Input
            value={form.secondVisitComments}
            onChange={(e) => setForm((prev) => ({ ...prev, secondVisitComments: e.target.value }))}
            placeholder="Comments"
          />
        </FormField>
        <FormField label="Currently Assigned To">
          <Input
            value={form.currentlyAssignedTo}
            onChange={(e) => setForm((prev) => ({ ...prev, currentlyAssignedTo: e.target.value }))}
            placeholder="Name or status"
          />
        </FormField>
        <FormField label="Closing Amount">
          <Input
            type="number"
            value={form.closingAmount}
            onChange={(e) => setForm((prev) => ({ ...prev, closingAmount: e.target.value }))}
            placeholder="0"
          />
        </FormField>
        <FormField label="Plan Start / Deployment Date">
          <Input
            type="date"
            value={form.planStartDate}
            onChange={(e) => setForm((prev) => ({ ...prev, planStartDate: e.target.value }))}
          />
        </FormField>
        <FormField label="Plan Expiry Date">
          <Input
            type="date"
            value={form.planExpiryDate}
            onChange={(e) => setForm((prev) => ({ ...prev, planExpiryDate: e.target.value }))}
          />
        </FormField>
        <FormField label="Location Link">
          <Input
            value={form.locationLink}
            onChange={(e) => setForm((prev) => ({ ...prev, locationLink: e.target.value }))}
            placeholder="https://maps.google.com/..."
          />
        </FormField>
        <FormField label="Currently Using Software">
          <Input
            value={form.currentPMS}
            onChange={(e) => setForm((prev) => ({ ...prev, currentPMS: e.target.value }))}
            placeholder="e.g. NILL, eZee"
          />
        </FormField>
        <FormField label="Connected OTA Platforms">
          <Input
            value={form.connectedOTAPlatforms}
            onChange={(e) => setForm((prev) => ({ ...prev, connectedOTAPlatforms: e.target.value }))}
            placeholder="Comma-separated: GO-MMT, Booking.com, Agoda"
          />
        </FormField>
        <div className="col-span-2">
          <FormField label="Comments">
            <Textarea
              rows={3}
              value={form.comments}
              onChange={(e) => setForm((prev) => ({ ...prev, comments: e.target.value }))}
              placeholder="Any comments..."
            />
          </FormField>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Property
        </Button>
      </div>
    </Modal>
  )
}
