import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  Save, 
  X,
  Building2, 
  User, 
  MapPin, 
  IndianRupee, 
  CalendarDays, 
  Monitor, 
  MessageSquare, 
  ShieldCheck,
  Globe,
  Star,
  Bed,
  Phone,
  Mail,
  ListRestart,
  Layout,
  RefreshCcw,
  Plus,
  CheckCircle2,
  Lock,
} from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { FormField, Input, Select, Textarea, Button, RadioGroup, Checkbox } from '@/components/FormElements'
import { fetchConfig, type AppConfig, type LocationNode } from '@/lib/configApi'
import { createProperty, updateProperty, fetchPropertyById } from '@/lib/propertiesApi'
import { cn } from '@/lib/utils'

/* --- Helper: Section Title --- */
function SectionHeader({ icon: Icon, title, description, className, titleClassName }: { icon: any, title: string, description?: string, className?: string, titleClassName?: string }) {
  return (
    <div className={cn("flex items-center gap-3 mb-6", className)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 ring-1 ring-primary-100/50">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className={cn("text-base font-bold text-surface-900 leading-none", titleClassName)}>{title}</h2>
        {description && <p className="text-xs text-surface-500 mt-1.5">{description}</p>}
      </div>
    </div>
  )
}

/* --- Helper: Card Wrapper --- */
function FormCard({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("bg-white rounded-2xl border border-surface-200 shadow-sm p-6 sm:p-8 transition-all hover:shadow-md", className)}>
      {children}
    </div>
  )
}

const PMS_OPTIONS = ['None', 'eZee', 'Hotelogix', 'Cloudbeds', 'IDS Next', 'Sirvoy', 'Little Hotelier', 'Other']
const OTA_OPTIONS = ['Booking.com', 'Agoda', 'Expedia', 'MakeMyTrip', 'Goibibo', 'Airbnb', 'Trip.com', 'Hostelworld']

type AddPropertyLocationState = {
  initialData?: Record<string, unknown>
  lockedFields?: string[]
  path?: string[]
  pathLabels?: string[]
}

export default function AddPropertyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Custom Option States
  const [customPMS, setCustomPMS] = useState('')
  const [showOtherOTA, setShowOtherOTA] = useState(false)
  const [otherOTAText, setOtherOTAText] = useState('')

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
    currentlyAssignedTo: '',
    closingAmount: '',
    planStartDate: '',
    planExpiryDate: '',
    locationLink: '',
    currentPMS: '',
    connectedOTAPlatforms: [] as string[],
    comments: '',
  }

  const [form, setForm] = useState(emptyForm)

  const lockedFields = useMemo(() => {
    if (isEdit) return new Set<string>()
    const s = (location.state ?? null) as AddPropertyLocationState | null
    return new Set(s?.lockedFields ?? [])
  }, [isEdit, location.state])

  const isFieldLocked = useCallback((field: string) => lockedFields.has(field), [lockedFields])

  useEffect(() => {
    fetchConfig().then(setConfig).catch(() => {})
    
    if (isEdit && id) {
      setIsLoading(true)
      fetchPropertyById(id).then(data => {
        if (data) {
          setForm({
            name: data.name || '',
            propertyType: data.property_type || '',
            propertyClass: data.property_class || '',
            roomCategory: data.room_category || '',
            numberOfRooms: String(data.number_of_rooms || ''),
            location: data.location || '',
            hasMultipleProperty: data.has_multiple_property || false,
            numberOfProperties: String(data.number_of_properties || ''),
            place: data.place || '',
            email: data.email || '',
            proposedPrice: String(data.proposed_price || ''),
            finalCommittedPrice: String(data.final_committed_price || ''),
            tenure: data.tenure || '',
            planType: data.plan_type || '',
            primaryContactPerson: data.primary_contact_person || '',
            contactPersonName: data.contact_person_name || '',
            contactNumber: data.contact_number || '',
            primaryPersonPosition: data.primary_person_position || '',
            executiveName: data.executive_name || '',
            firstVisitDate: data.first_visit_date || '',
            firstVisitStatus: data.first_visit_status || '',
            currentlyAssignedTo: data.currently_assigned_to || '',
            closingAmount: String(data.closing_amount || ''),
            planStartDate: data.plan_start_date || '',
            planExpiryDate: data.plan_expiry_date || '',
            connectedOTAPlatforms: Array.isArray(data.connected_ota_platforms) ? data.connected_ota_platforms : [],
            locationLink: data.location_link || '',
            currentPMS: data.current_pms || '',
            comments: data.comments || '',
          })

          // Handle Custom Options Initialization
          if (data.current_pms && data.current_pms !== 'None' && !PMS_OPTIONS.includes(data.current_pms)) {
            setForm(prev => ({ ...prev, currentPMS: 'Other' }))
            setCustomPMS(data.current_pms)
          } else {
            setForm(prev => ({ ...prev, currentPMS: data.current_pms || 'None' }))
          }

          if (Array.isArray(data.connected_ota_platforms)) {
            const standard = data.connected_ota_platforms.filter(o => OTA_OPTIONS.includes(o))
            const custom = data.connected_ota_platforms.filter(o => !OTA_OPTIONS.includes(o))
            if (custom.length > 0) {
              setShowOtherOTA(true)
              setOtherOTAText(custom.join(', '))
            }
          }
        }
      }).catch(() => {}).finally(() => setIsLoading(false))
    } else {
      const state = (location.state ?? null) as AddPropertyLocationState | null
      if (state?.initialData) {
        const data = state.initialData
        setForm((prev) => ({
          ...prev,
          name: String(data.name || data.propertyName || ''),
          email: String(data.email || ''),
          contactPersonName: String(data.contactPersonName || ''),
          contactNumber: String(data.contactNumber || ''),
          location: String(data.location || ''),
          place: String(data.place || ''),
          connectedOTAPlatforms: Array.isArray(data.connectedOTAPlatforms)
            ? (data.connectedOTAPlatforms as string[])
            : [],
        }))
      }
    }
  }, [isEdit, id, location.state])

  const propertyTypes = config?.property_types ?? []
  const propertyClasses = config?.property_classes ?? []
  const roomCategories = config?.room_categories ?? []
  const tenureOptions = config?.tenure_options ?? []
  const planTypeOptions = config?.plan_type_options ?? []
  const primaryContactOptions = config?.primary_contact_options ?? []
  const firstVisitStatusOptions = config?.first_visit_status_options ?? []
  const visitStatusOptions = config?.visit_status_options ?? []

  const handleSave = async (draft: boolean = false) => {
    if (!draft && !form.name.trim()) {
      setError('Property name is required')
      return
    }

    setIsSubmitting(!draft)
    setError(null)

    try {
      const stateData = (location.state ?? null) as AddPropertyLocationState | null
      const path = stateData?.path || []
      
      const locationHierarchy: LocationNode[] = config?.location_hierarchy ?? []
      const stateNode = path[0] ? locationHierarchy.find((s) => s.id === path[0]) : null
      const districtNode = stateNode?.children?.find((d) => d.id === path[1])
      
      const stateName = stateNode?.name ?? 'Kerala'
      const districtName = districtNode?.name ?? 'Wayanad'

      // Process Custom Fields
      const finalPMS = form.currentPMS === 'Other' ? customPMS.trim() : form.currentPMS
      const customOTAList = showOtherOTA ? otherOTAText.split(',').map(s => s.trim()).filter(Boolean) : []
      const finalOTAs = [...form.connectedOTAPlatforms, ...customOTAList]

      const payload: any = {
        name: form.name.trim() || 'Untitled Draft',
        property_type: form.propertyType || (draft ? undefined : propertyTypes[0]),
        property_class: form.propertyClass || (draft ? undefined : propertyClasses[0]),
        room_category: form.roomCategory || (draft ? undefined : roomCategories[0]),
        number_of_rooms: Number(form.numberOfRooms) || 0,
        has_multiple_property: form.hasMultipleProperty,
        number_of_properties: Number(form.numberOfProperties) || null,
        email: form.email,
        proposed_price: form.proposedPrice || '0.00',
        final_committed_price: form.finalCommittedPrice || '0.00',
        tenure: form.tenure || (draft ? undefined : tenureOptions[0]),
        place: form.place,
        primary_contact_person: form.primaryContactPerson,
        contact_person_name: form.contactPersonName,
        contact_number: form.contactNumber,
        primary_person_position: form.primaryPersonPosition,
        executive_name: form.executiveName,
        first_visit_date: form.firstVisitDate,
        first_visit_status: form.firstVisitStatus,
        currently_assigned_to: form.currentlyAssignedTo,
        closing_amount: form.closingAmount || '0.00',
        plan_start_date: form.planStartDate,
        plan_expiry_date: form.planExpiryDate,
        location_link: form.locationLink,
        current_pms: finalPMS || 'None',
        connected_ota_platforms: finalOTAs,
        comments: form.comments,
        state: stateName,
        district: districtName,
        location: form.location.trim() || form.place.trim() || undefined,
        is_draft: draft,
      }

      const res = isEdit && id 
        ? await updateProperty(id, payload)
        : await createProperty(payload)
      
      if (!draft) {
        navigate('/properties')
      } else {
        setSaveStatus('Draft updated ' + new Date().toLocaleTimeString())
        setTimeout(() => setSaveStatus(null), 3000)
      }
    } catch (e: any) {
      setError(e instanceof Error ? e.message : 'Could not save property')
    } finally {
      setIsLoading(false)
      setIsSubmitting(false)
    }
  }

  // Auto-save logic
  useEffect(() => {
    if (!form.name.trim() && !form.contactNumber.trim()) return // Don't auto-save empty forms
    
    const timer = setTimeout(() => {
      handleSave(true)
    }, 30000) // Auto-save every 30 seconds if changes occur
    
    return () => clearTimeout(timer)
  }, [form])

  const breadcrumbItems = [
    { label: 'Properties', onClick: () => navigate('/properties') },
    { label: 'Onboard Property' }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-surface-50/30">
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-surface-200/60 transition-all">
        <div className="flex h-20 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
             <button
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-surface-100/50 text-surface-600 transition-all hover:bg-surface-200 hover:text-surface-900 active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex flex-col min-w-0">
              <Breadcrumb items={breadcrumbItems} className="mb-0.5" />
              <h1 className="text-base sm:text-xl font-bold text-surface-900 truncate">
                {isEdit ? (
                  <>
                    <span className="hidden sm:inline">Edit Property: </span>
                    <span>{form.name || 'Loading...'}</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Onboard New Property</span>
                    <span className="sm:hidden">New Property</span>
                  </>
                )}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
             <span className="hidden lg:inline-block text-[10px] text-surface-400 italic mr-2">
              Auto-saving as draft...
            </span>
            <Button 
              variant="secondary" 
              onClick={() => handleSave(true)}
              className="h-10 border-surface-200 px-2 sm:px-4"
              title="Save Draft"
            >
              <Save className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Save Draft</span>
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate(-1)} 
              className="hidden md:flex h-10 border-surface-200"
            >
              Discard
            </Button>
            <Button 
              onClick={() => handleSave(false)} 
              disabled={isSubmitting} 
              className="h-10 px-3 sm:px-8 shadow-lg shadow-primary-500/10 gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="hidden sm:inline">{isEdit ? 'Save Changes' : 'Complete Onboarding'}</span>
                  <span className="sm:hidden">{isEdit ? 'Save' : 'Complete'}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 py-6 sm:py-10">
        {!isEdit && lockedFields.size > 0 && (
          <div className="mb-6 flex gap-3 rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 shadow-sm">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
            <div>
              <p className="font-semibold text-amber-950">Lead details are locked</p>
              <p className="mt-1 text-xs leading-relaxed text-amber-900/85">
                Name, contact, and location were copied from the trade fair lead and cannot be changed here.
                Fill in the remaining fields to complete onboarding.
              </p>
            </div>
          </div>
        )}
        <div className="grid w-full grid-cols-1 gap-6 sm:gap-10 lg:grid-cols-12">
          
          {/* Left Column: Form Content */}
          <div className="order-1 lg:order-1 lg:col-span-8 space-y-6 sm:space-y-8">
            {error && (
              <div className="group rounded-2xl bg-red-50/50 border border-red-100 p-4 sm:p-5 text-sm text-red-600 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <X className="h-4 w-4" />
                </div>
                <p className="font-medium truncate">{error}</p>
              </div>
            )}

            {/* Section 1: Identity */}
            <FormCard>
              <SectionHeader 
                icon={Building2} 
                title="Property Identity" 
                description="The core information that identifies this property in the ecosystem." 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="md:col-span-2">
                  <FormField label="Full Property Name" required>
                    <div className="relative">
                      <Input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Royal Woods Heritage Resort"
                        disabled={isFieldLocked('name')}
                        className={cn(
                          'pl-10 text-base font-semibold',
                          isFieldLocked('name') &&
                            'cursor-not-allowed bg-surface-50 text-surface-700 disabled:border-surface-200 disabled:opacity-100'
                        )}
                      />
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                    </div>
                  </FormField>
                </div>
                <FormField label="Property Type" required>
                  <Select
                    value={form.propertyType}
                    onChange={(value) => setForm({ ...form, propertyType: value })}
                    options={propertyTypes.map((t) => ({ label: t, value: t }))}
                  />
                </FormField>
                <FormField label="Property Class">
                  <Select
                    value={form.propertyClass}
                    onChange={(value) => setForm({ ...form, propertyClass: value })}
                    options={propertyClasses.map((c) => ({ label: c, value: c }))}
                  />
                </FormField>
                <FormField label="Room Category">
                  <Select
                    value={form.roomCategory}
                    onChange={(value) => setForm({ ...form, roomCategory: value })}
                    options={roomCategories.map((r) => ({ label: r, value: r }))}
                  />
                </FormField>
                <FormField label="Number of Guest Rooms">
                  <Input
                    type="number"
                    value={form.numberOfRooms}
                    onChange={(e) => setForm({ ...form, numberOfRooms: e.target.value })}
                    placeholder="Total room count"
                  />
                </FormField>
              </div>
              
              <div className="mt-8 pt-6 sm:pt-8 border-t border-surface-100">
                <div className="flex items-center gap-4 mb-6">
                   <div className="h-px flex-1 bg-surface-100" />
                   <span className="text-[10px] uppercase tracking-widest font-bold text-surface-400">Multiple Units</span>
                   <div className="h-px flex-1 bg-surface-100" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                   <FormField label="Has Multiple Properties?">
                    <RadioGroup
                      name="hasMultipleProperty"
                      value={form.hasMultipleProperty ? 'Yes' : 'No'}
                      onChange={(value) => setForm({ ...form, hasMultipleProperty: value === 'Yes' })}
                      options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]}
                    />
                  </FormField>
                  {form.hasMultipleProperty && (
                    <FormField label="Total Number of Properties">
                      <Input
                        type="number"
                        value={form.numberOfProperties}
                        onChange={(e) => setForm({ ...form, numberOfProperties: e.target.value })}
                        placeholder="e.g. 5"
                      />
                    </FormField>
                  )}
                </div>
              </div>
            </FormCard>

            {/* Section 2: Financials */}
            <FormCard>
              <SectionHeader 
                icon={IndianRupee} 
                title="Commercial Setup" 
                description="Financial commitments and subscription details." 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <FormField label="Proposed Price">
                  <Input
                    type="number"
                    value={form.proposedPrice}
                    onChange={(e) => setForm({ ...form, proposedPrice: e.target.value })}
                    placeholder="0.00"
                  />
                </FormField>
                <FormField label="Committed Price">
                  <Input
                    type="number"
                    value={form.finalCommittedPrice}
                    onChange={(e) => setForm({ ...form, finalCommittedPrice: e.target.value })}
                    placeholder="0.00"
                  />
                </FormField>
                <FormField label="Closing Amount">
                  <Input
                    type="number"
                    value={form.closingAmount}
                    onChange={(e) => setForm({ ...form, closingAmount: e.target.value })}
                    placeholder="0.00"
                  />
                </FormField>
                <FormField label="Subscription Tenure">
                  <Select
                    value={form.tenure}
                    onChange={(value) => setForm({ ...form, tenure: value })}
                    options={tenureOptions.map((t) => ({ label: t, value: t }))}
                  />
                </FormField>
                <FormField label="Plan Selected">
                  <Select
                    value={form.planType}
                    onChange={(value) => setForm({ ...form, planType: value })}
                    options={planTypeOptions.map((p) => ({ label: p, value: p }))}
                  />
                </FormField>
                <FormField label="Activation Date" required>
                  <Input
                    type="date"
                    value={form.planStartDate}
                    onChange={(e) => setForm({ ...form, planStartDate: e.target.value })}
                  />
                </FormField>
                <FormField label="Expiry Date" required>
                  <Input
                    type="date"
                    value={form.planExpiryDate}
                    onChange={(e) => setForm({ ...form, planExpiryDate: e.target.value })}
                  />
                </FormField>
              </div>
            </FormCard>

            {/* Section 3: Operations & Visits */}
            <FormCard>
              <SectionHeader 
                icon={CalendarDays} 
                title="Sales Lifecycle" 
                description="Tracking the acquisition journey and field visits." 
              />
              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  <FormField label="Primary Executive">
                    <Input
                      value={form.executiveName}
                      onChange={(e) => setForm({ ...form, executiveName: e.target.value })}
                      placeholder="Visit by..."
                    />
                  </FormField>
                  <FormField label="Initial Visit Date" required>
                    <Input
                      type="date"
                      value={form.firstVisitDate}
                      onChange={(e) => setForm({ ...form, firstVisitDate: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Initial Outcome">
                    <Select
                      value={form.firstVisitStatus}
                      onChange={(value) => setForm({ ...form, firstVisitStatus: value })}
                      options={firstVisitStatusOptions.map((s) => ({ label: s, value: s }))}
                    />
                  </FormField>
                   <FormField label="Currently Assigned">
                    <Input
                      value={form.currentlyAssignedTo}
                      onChange={(e) => setForm({ ...form, currentlyAssignedTo: e.target.value })}
                      placeholder="Current handler..."
                    />
                  </FormField>
                </div>
              </div>
            </FormCard>
          </div>

          {/* Right Column: Sidebar Info */}
          <div className="order-2 lg:order-2 lg:col-span-4 space-y-4 sm:space-y-6">
            
            {/* Contact Card - Important: Order 2 but should probably be next to Property Identity on mobile */}
            {/* No change needed for Order 2 as Identity is in Order 1, this follows naturally. */}
            <div className="p-5 sm:p-6 rounded-3xl bg-primary-900 text-white shadow-xl shadow-primary-900/10 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 transition-transform group-hover:scale-110" />
              <div className="absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-white/5" />
              
              <SectionHeader 
                icon={Phone} 
                title="Primary Contact" 
                titleClassName="text-white"
                className="!mb-6"
              />
              <div className="space-y-5 relative z-10">
                <FormField label="Manager/Owner Name" labelClassName="text-white/80" required>
                  <div className="relative">
                    <Input
                      value={form.contactPersonName}
                      onChange={(e) => setForm({ ...form, contactPersonName: e.target.value })}
                      placeholder="Full name"
                      disabled={isFieldLocked('contactPersonName')}
                      className={cn(
                        'border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:ring-white/30',
                        isFieldLocked('contactPersonName') &&
                          'cursor-not-allowed disabled:border-white/15 disabled:bg-white/5 disabled:text-white/90 disabled:opacity-100'
                      )}
                    />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  </div>
                </FormField>
                <FormField label="Phone Number" labelClassName="text-white/80" required>
                  <div className="relative">
                    <Input
                      value={form.contactNumber}
                      onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      disabled={isFieldLocked('contactNumber')}
                      className={cn(
                        'border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:ring-white/30',
                        isFieldLocked('contactNumber') &&
                          'cursor-not-allowed disabled:border-white/15 disabled:bg-white/5 disabled:text-white/90 disabled:opacity-100'
                      )}
                    />
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  </div>
                </FormField>
                <FormField label="Official Email" labelClassName="text-white/80">
                  <div className="relative">
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="owner@hotel.com"
                      disabled={isFieldLocked('email')}
                      className={cn(
                        'border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:ring-white/30',
                        isFieldLocked('email') &&
                          'cursor-not-allowed disabled:border-white/15 disabled:bg-white/5 disabled:text-white/90 disabled:opacity-100'
                      )}
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  </div>
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Role" labelClassName="text-white/80">
                    <Select
                      value={form.primaryContactPerson}
                      onChange={(value) => setForm({ ...form, primaryContactPerson: value })}
                      options={primaryContactOptions.map((p) => ({ label: p, value: p }))}
                      className="bg-white/10 border-white/20 text-white [&>option]:text-surface-900"
                    />
                  </FormField>
                  <FormField label="Position" labelClassName="text-white/80">
                    <Input
                      value={form.primaryPersonPosition}
                      onChange={(e) => setForm({ ...form, primaryPersonPosition: e.target.value })}
                      placeholder="e.g. Owner"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:ring-white/30"
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-surface-200 shadow-sm space-y-5">
              <SectionHeader 
                icon={MapPin} 
                title="Geography" 
              />
              <div className="space-y-4">
                <FormField label="Place Name" required>
                  <Input
                    value={form.place}
                    onChange={(e) => setForm({ ...form, place: e.target.value })}
                    placeholder="Town/Village"
                    disabled={isFieldLocked('place')}
                    className={cn(
                      isFieldLocked('place') &&
                        'cursor-not-allowed bg-surface-50 text-surface-700 disabled:border-surface-200 disabled:opacity-100'
                    )}
                  />
                </FormField>
                <FormField label="Detailed Location">
                  <Input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Street/Area"
                    disabled={isFieldLocked('location')}
                    className={cn(
                      isFieldLocked('location') &&
                        'cursor-not-allowed bg-surface-50 text-surface-700 disabled:border-surface-200 disabled:opacity-100'
                    )}
                  />
                </FormField>
                <FormField label="Maps Navigation Link">
                  <Input
                    value={form.locationLink}
                    onChange={(e) => setForm({ ...form, locationLink: e.target.value })}
                    placeholder="https://maps.google.com/..."
                  />
                </FormField>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-surface-200 shadow-sm space-y-5">
              <SectionHeader 
                icon={Monitor} 
                title="Existing Ecosystem" 
              />
              <div className="space-y-4">
                <FormField label="Current Software (PMS)">
                  <div className="space-y-3">
                    <Select
                      value={form.currentPMS}
                      onChange={(val) => setForm(prev => ({ ...prev, currentPMS: val }))}
                      options={PMS_OPTIONS.map(opt => ({ label: opt, value: opt }))}
                      placeholder="None"
                    />
                    {form.currentPMS === 'Other' && (
                      <Input
                        value={customPMS}
                        onChange={(e) => setCustomPMS(e.target.value)}
                        placeholder="Type current software name..."
                        className="animate-in fade-in slide-in-from-top-1 duration-200"
                        autoFocus
                      />
                    )}
                  </div>
                </FormField>

                <FormField label="OTA Channels">
                  <div className="space-y-4 p-4 bg-surface-50/50 rounded-xl border border-surface-200/60">
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-y-4 gap-x-6">
                      {OTA_OPTIONS.map(ota => (
                        <Checkbox
                          key={ota}
                          label={ota}
                          checked={form.connectedOTAPlatforms.includes(ota)}
                          onChange={(checked) => {
                            setForm(prev => {
                              const current = prev.connectedOTAPlatforms
                              if (checked) {
                                return { ...prev, connectedOTAPlatforms: [...current, ota] }
                              } else {
                                return { ...prev, connectedOTAPlatforms: current.filter(c => c !== ota) }
                              }
                            })
                          }}
                          className="min-w-0"
                        />
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-surface-200/60">
                      <Checkbox
                        label="Other Channels"
                        checked={showOtherOTA}
                        onChange={(val) => setShowOtherOTA(val)}
                      />
                      {showOtherOTA && (
                        <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                          <Input
                            value={otherOTAText}
                            onChange={(e) => setOtherOTAText(e.target.value)}
                            placeholder="Type other channels (comma separated)..."
                            autoFocus
                          />
                          <p className="mt-1.5 text-[11px] text-surface-500 ml-1">
                            Add multiple channels separated by commas (e.g. Stays, Hostelworld)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </FormField>
              </div>
            </div>

            {/* Final Comments */}
            <div className="p-5 sm:p-6 rounded-3xl bg-accent-50/50 border border-accent-100/50 space-y-4">
              <div className="flex items-center gap-2 font-bold text-accent-700 text-sm">
                <MessageSquare className="h-4 w-4" />
                Additional Remarks
              </div>
              <Textarea
                value={form.comments}
                onChange={(e) => setForm({ ...form, comments: e.target.value })}
                placeholder="Any special instructions or notes..."
                rows={4}
                className="bg-white/80"
              />
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-accent-600/70 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                This property will be audited after submission.
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
