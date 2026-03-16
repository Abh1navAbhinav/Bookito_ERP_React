// ============================================================
// BOOKITO ERP — Mock Data
// ============================================================

// ---------- Hierarchy ----------
export interface LocationNode {
  id: string
  name: string
  children?: LocationNode[]
}

export const locationHierarchy: LocationNode[] = [
  {
    id: 'kerala',
    name: 'Kerala',
    children: [
      {
        id: 'kozhikode',
        name: 'Kozhikode',
        children: [
          { id: 'calicut-beach', name: 'Calicut Beach' },
          { id: 'kappad', name: 'Kappad' },
          { id: 'beypore', name: 'Beypore' },
        ],
      },
      {
        id: 'ernakulam',
        name: 'Ernakulam',
        children: [
          { id: 'fort-kochi', name: 'Fort Kochi' },
          { id: 'marine-drive', name: 'Marine Drive' },
          { id: 'cherai', name: 'Cherai Beach' },
        ],
      },
      {
        id: 'trivandrum',
        name: 'Trivandrum',
        children: [
          { id: 'kovalam', name: 'Kovalam' },
          { id: 'varkala', name: 'Varkala' },
        ],
      },
    ],
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    children: [
      {
        id: 'bangalore',
        name: 'Bangalore',
        children: [
          { id: 'mg-road', name: 'MG Road' },
          { id: 'whitefield', name: 'Whitefield' },
          { id: 'indiranagar', name: 'Indiranagar' },
        ],
      },
      {
        id: 'mysore',
        name: 'Mysore',
        children: [
          { id: 'mysore-city', name: 'Mysore City' },
        ],
      },
    ],
  },
  {
    id: 'goa',
    name: 'Goa',
    children: [
      {
        id: 'north-goa',
        name: 'North Goa',
        children: [
          { id: 'calangute', name: 'Calangute' },
          { id: 'baga', name: 'Baga' },
          { id: 'anjuna', name: 'Anjuna' },
        ],
      },
      {
        id: 'south-goa',
        name: 'South Goa',
        children: [
          { id: 'palolem', name: 'Palolem' },
          { id: 'colva', name: 'Colva' },
        ],
      },
    ],
  },
]

// ---------- Property Types ----------
export const propertyTypes = ['Resort', 'Hotel', 'Homestay', 'Business Class Hotel', 'Lodging', 'Cottage'] as const
export const propertyClasses = ['Luxury', 'Premium', 'Standard', 'Average'] as const
export const roomCategories = ['1-10 rooms', '11-20 rooms', '21-30 rooms', '30+ rooms'] as const
export const tenureOptions = ['6 Months', '1 Year'] as const
export const primaryContactOptions = ['HR', 'Front Office', 'Manager', 'Owner'] as const
export const visitStatusOptions = ['Closed', 'Interested', 'Not Interested', 'Rescheduled'] as const

export interface Property {
  id: string
  slno: number
  name: string
  propertyType: typeof propertyTypes[number]
  propertyClass: typeof propertyClasses[number]
  roomCategory: typeof roomCategories[number]
  numberOfRooms: number
  hasMultipleProperty: boolean
  email: string
  proposedPrice: number
  finalCommittedPrice: number
  tenure: typeof tenureOptions[number]
  place: string
  primaryContactPerson: typeof primaryContactOptions[number]
  contactPersonName: string
  contactNumber: string
  firstVisitDate: string
  firstVisitStatus: string
  comments: string
  rescheduledDate?: string
  rescheduledComment?: string
  secondVisitExecutive?: string
  secondVisitDate?: string
  secondVisitStatus?: typeof visitStatusOptions[number]
  closingAmount?: number
  planStartDate: string
  planExpiryDate: string
  locationLink: string
  currentPMS: string
  connectedOTAPlatforms: string[]
  state: string
  district: string
  location: string
}

export const properties: Property[] = [
  {
    id: 'p1',
    slno: 1,
    name: 'Ocean Breeze Resort',
    propertyType: 'Resort',
    propertyClass: 'Luxury',
    roomCategory: '30+ rooms',
    numberOfRooms: 45,
    hasMultipleProperty: true,
    email: 'info@oceanbreeze.com',
    proposedPrice: 150000,
    finalCommittedPrice: 135000,
    tenure: '1 Year',
    place: 'Calicut Beach',
    primaryContactPerson: 'Manager',
    contactPersonName: 'Rajesh Kumar',
    contactNumber: '+91 98765 43210',
    firstVisitDate: '2025-12-15',
    firstVisitStatus: 'Completed',
    comments: 'Very interested in premium plan with OTA integration.',
    secondVisitExecutive: 'Anil Menon',
    secondVisitDate: '2025-12-22',
    secondVisitStatus: 'Closed',
    closingAmount: 135000,
    planStartDate: '2026-01-01',
    planExpiryDate: '2026-12-31',
    locationLink: 'https://maps.google.com/?q=11.2588,75.7804',
    currentPMS: 'None',
    connectedOTAPlatforms: ['Booking.com', 'MakeMyTrip', 'Goibibo'],
    state: 'Kerala',
    district: 'Kozhikode',
    location: 'Calicut Beach',
  },
  {
    id: 'p2',
    slno: 2,
    name: 'Kappad Heritage Inn',
    propertyType: 'Hotel',
    propertyClass: 'Premium',
    roomCategory: '11-20 rooms',
    numberOfRooms: 18,
    hasMultipleProperty: false,
    email: 'book@kappadinn.in',
    proposedPrice: 85000,
    finalCommittedPrice: 78000,
    tenure: '1 Year',
    place: 'Kappad',
    primaryContactPerson: 'Owner',
    contactPersonName: 'Priya Nair',
    contactNumber: '+91 87654 32109',
    firstVisitDate: '2025-11-20',
    firstVisitStatus: 'Completed',
    comments: 'Wants channel manager integration.',
    secondVisitExecutive: 'Deepa S',
    secondVisitDate: '2025-12-05',
    secondVisitStatus: 'Closed',
    closingAmount: 78000,
    planStartDate: '2026-01-10',
    planExpiryDate: '2027-01-09',
    locationLink: 'https://maps.google.com/?q=11.3850,75.7217',
    currentPMS: 'eZee',
    connectedOTAPlatforms: ['OYO', 'Agoda'],
    state: 'Kerala',
    district: 'Kozhikode',
    location: 'Kappad',
  },
  {
    id: 'p3',
    slno: 3,
    name: 'Beypore Cottage Stay',
    propertyType: 'Cottage',
    propertyClass: 'Standard',
    roomCategory: '1-10 rooms',
    numberOfRooms: 6,
    hasMultipleProperty: false,
    email: 'stay@beyporecottage.com',
    proposedPrice: 35000,
    finalCommittedPrice: 30000,
    tenure: '6 Months',
    place: 'Beypore',
    primaryContactPerson: 'Owner',
    contactPersonName: 'Suresh Babu',
    contactNumber: '+91 76543 21098',
    firstVisitDate: '2026-01-10',
    firstVisitStatus: 'Completed',
    comments: 'Small property but interested in trial.',
    secondVisitStatus: 'Interested',
    planStartDate: '2026-02-01',
    planExpiryDate: '2026-07-31',
    locationLink: 'https://maps.google.com/?q=11.1700,75.8045',
    currentPMS: 'Manual',
    connectedOTAPlatforms: [],
    state: 'Kerala',
    district: 'Kozhikode',
    location: 'Beypore',
  },
  {
    id: 'p4',
    slno: 4,
    name: 'Fort Kochi Grand Hotel',
    propertyType: 'Business Class Hotel',
    propertyClass: 'Luxury',
    roomCategory: '30+ rooms',
    numberOfRooms: 72,
    hasMultipleProperty: true,
    email: 'reservations@fkgrand.com',
    proposedPrice: 250000,
    finalCommittedPrice: 220000,
    tenure: '1 Year',
    place: 'Fort Kochi',
    primaryContactPerson: 'Manager',
    contactPersonName: 'Anitha George',
    contactNumber: '+91 90123 45678',
    firstVisitDate: '2025-10-05',
    firstVisitStatus: 'Completed',
    comments: 'Enterprise client, wants custom dashboard.',
    secondVisitExecutive: 'Anil Menon',
    secondVisitDate: '2025-10-20',
    secondVisitStatus: 'Closed',
    closingAmount: 220000,
    planStartDate: '2025-11-01',
    planExpiryDate: '2026-10-31',
    locationLink: 'https://maps.google.com/?q=9.9658,76.2421',
    currentPMS: 'Hotelogix',
    connectedOTAPlatforms: ['Booking.com', 'Expedia', 'MakeMyTrip', 'Airbnb'],
    state: 'Kerala',
    district: 'Ernakulam',
    location: 'Fort Kochi',
  },
  {
    id: 'p5',
    slno: 5,
    name: 'Marine Drive Suites',
    propertyType: 'Hotel',
    propertyClass: 'Premium',
    roomCategory: '21-30 rooms',
    numberOfRooms: 28,
    hasMultipleProperty: false,
    email: 'info@marinedrivesuites.com',
    proposedPrice: 120000,
    finalCommittedPrice: 0,
    tenure: '1 Year',
    place: 'Marine Drive',
    primaryContactPerson: 'Front Office',
    contactPersonName: 'Meera Krishnan',
    contactNumber: '+91 88776 65544',
    firstVisitDate: '2026-02-14',
    firstVisitStatus: 'Completed',
    comments: 'Interested but evaluating competitors.',
    secondVisitStatus: 'Interested',
    planStartDate: '',
    planExpiryDate: '',
    locationLink: 'https://maps.google.com/?q=9.9816,76.2752',
    currentPMS: 'IDS Next',
    connectedOTAPlatforms: ['Booking.com', 'Goibibo'],
    state: 'Kerala',
    district: 'Ernakulam',
    location: 'Marine Drive',
  },
  {
    id: 'p6',
    slno: 6,
    name: 'Kovalam Beach Resort',
    propertyType: 'Resort',
    propertyClass: 'Luxury',
    roomCategory: '30+ rooms',
    numberOfRooms: 55,
    hasMultipleProperty: true,
    email: 'bookings@kovalamresort.com',
    proposedPrice: 200000,
    finalCommittedPrice: 185000,
    tenure: '1 Year',
    place: 'Kovalam',
    primaryContactPerson: 'Manager',
    contactPersonName: 'Dr. Vineeth R',
    contactNumber: '+91 94123 67890',
    firstVisitDate: '2025-09-12',
    firstVisitStatus: 'Completed',
    comments: 'Closing expected soon. High-value client.',
    secondVisitExecutive: 'Deepa S',
    secondVisitDate: '2025-09-25',
    secondVisitStatus: 'Closed',
    closingAmount: 185000,
    planStartDate: '2025-10-01',
    planExpiryDate: '2026-03-20',
    locationLink: 'https://maps.google.com/?q=8.4000,76.9780',
    currentPMS: 'Opera',
    connectedOTAPlatforms: ['Booking.com', 'Expedia', 'Agoda', 'TripAdvisor'],
    state: 'Kerala',
    district: 'Trivandrum',
    location: 'Kovalam',
  },
  {
    id: 'p7',
    slno: 7,
    name: 'Baga Beachfront Hotel',
    propertyType: 'Hotel',
    propertyClass: 'Premium',
    roomCategory: '21-30 rooms',
    numberOfRooms: 25,
    hasMultipleProperty: false,
    email: 'info@bagabeachfront.com',
    proposedPrice: 110000,
    finalCommittedPrice: 95000,
    tenure: '1 Year',
    place: 'Baga',
    primaryContactPerson: 'Owner',
    contactPersonName: 'Rahul D\'Souza',
    contactNumber: '+91 83214 56789',
    firstVisitDate: '2026-01-20',
    firstVisitStatus: 'Completed',
    comments: 'Goa market entry. Very positive feedback.',
    secondVisitExecutive: 'Anil Menon',
    secondVisitDate: '2026-02-05',
    secondVisitStatus: 'Closed',
    closingAmount: 95000,
    planStartDate: '2026-02-15',
    planExpiryDate: '2027-02-14',
    locationLink: 'https://maps.google.com/?q=15.5558,73.7514',
    currentPMS: 'None',
    connectedOTAPlatforms: ['Booking.com', 'MakeMyTrip'],
    state: 'Goa',
    district: 'North Goa',
    location: 'Baga',
  },
  {
    id: 'p8',
    slno: 8,
    name: 'Whitefield Business Lodging',
    propertyType: 'Lodging',
    propertyClass: 'Standard',
    roomCategory: '11-20 rooms',
    numberOfRooms: 16,
    hasMultipleProperty: false,
    email: 'book@wflodging.in',
    proposedPrice: 55000,
    finalCommittedPrice: 0,
    tenure: '6 Months',
    place: 'Whitefield',
    primaryContactPerson: 'HR',
    contactPersonName: 'Kavitha M',
    contactNumber: '+91 72345 98761',
    firstVisitDate: '2026-03-01',
    firstVisitStatus: 'Completed',
    comments: 'Budget constraints. Follow up in April.',
    rescheduledDate: '2026-04-10',
    rescheduledComment: 'Client requested follow-up after quarterly budget review.',
    secondVisitStatus: 'Rescheduled',
    planStartDate: '',
    planExpiryDate: '',
    locationLink: 'https://maps.google.com/?q=12.9698,77.7500',
    currentPMS: 'None',
    connectedOTAPlatforms: [],
    state: 'Karnataka',
    district: 'Bangalore',
    location: 'Whitefield',
  },
]

// ---------- Dashboard Stats ----------
export const dashboardStats = {
  totalProperties: 248,
  totalRevenue: 12450000,
  pendingPayments: 3200000,
  activeTravelAgents: 87,
  salesClosingsThisMonth: 14,
  upcomingPlanExpiry: 6,
}

// ---------- Revenue Chart Data ----------
export const revenueChartData = [
  { month: 'Apr', revenue: 850000, target: 900000 },
  { month: 'May', revenue: 920000, target: 900000 },
  { month: 'Jun', revenue: 780000, target: 950000 },
  { month: 'Jul', revenue: 1050000, target: 1000000 },
  { month: 'Aug', revenue: 1120000, target: 1000000 },
  { month: 'Sep', revenue: 980000, target: 1050000 },
  { month: 'Oct', revenue: 1250000, target: 1100000 },
  { month: 'Nov', revenue: 1180000, target: 1100000 },
  { month: 'Dec', revenue: 1350000, target: 1200000 },
  { month: 'Jan', revenue: 1420000, target: 1200000 },
  { month: 'Feb', revenue: 1080000, target: 1250000 },
  { month: 'Mar', revenue: 1470000, target: 1300000 },
]

export const salesPerformanceData = [
  { name: 'Anil Menon', closings: 28, demos: 45, trials: 18, revenue: 3250000 },
  { name: 'Deepa S', closings: 22, demos: 38, trials: 15, revenue: 2870000 },
  { name: 'Rajan K', closings: 19, demos: 32, trials: 12, revenue: 2150000 },
  { name: 'Meera Nair', closings: 15, demos: 28, trials: 10, revenue: 1780000 },
  { name: 'Vishal P', closings: 12, demos: 22, trials: 8, revenue: 1400000 },
]

export const propertyDistributionData = [
  { name: 'Resort', value: 48, color: '#6366f1' },
  { name: 'Hotel', value: 85, color: '#818cf8' },
  { name: 'Homestay', value: 42, color: '#a5b4fc' },
  { name: 'Business Class', value: 35, color: '#10b981' },
  { name: 'Lodging', value: 22, color: '#34d399' },
  { name: 'Cottage', value: 16, color: '#6ee7b7' },
]

export const closingVsPendingData = [
  { month: 'Oct', closed: 12, pending: 5 },
  { month: 'Nov', closed: 15, pending: 8 },
  { month: 'Dec', closed: 18, pending: 6 },
  { month: 'Jan', closed: 22, pending: 9 },
  { month: 'Feb', closed: 14, pending: 7 },
  { month: 'Mar', closed: 20, pending: 4 },
]

// ---------- Finance ----------
export interface FinanceRecord {
  id: string
  propertyName: string
  state: string
  district: string
  location: string
  closingAmount: number
  pendingAmount: number
  collectedAmount: number
  invoiceUploaded: boolean
  invoiceDate?: string
  lastPaymentDate?: string
}

export const financeRecords: FinanceRecord[] = [
  { id: 'f1', propertyName: 'Ocean Breeze Resort', state: 'Kerala', district: 'Kozhikode', location: 'Calicut Beach', closingAmount: 135000, pendingAmount: 0, collectedAmount: 135000, invoiceUploaded: true, invoiceDate: '2026-01-05', lastPaymentDate: '2026-01-10' },
  { id: 'f2', propertyName: 'Kappad Heritage Inn', state: 'Kerala', district: 'Kozhikode', location: 'Kappad', closingAmount: 78000, pendingAmount: 28000, collectedAmount: 50000, invoiceUploaded: true, invoiceDate: '2026-01-15', lastPaymentDate: '2026-02-01' },
  { id: 'f3', propertyName: 'Fort Kochi Grand Hotel', state: 'Kerala', district: 'Ernakulam', location: 'Fort Kochi', closingAmount: 220000, pendingAmount: 70000, collectedAmount: 150000, invoiceUploaded: true, invoiceDate: '2025-11-10', lastPaymentDate: '2026-01-15' },
  { id: 'f4', propertyName: 'Kovalam Beach Resort', state: 'Kerala', district: 'Trivandrum', location: 'Kovalam', closingAmount: 185000, pendingAmount: 85000, collectedAmount: 100000, invoiceUploaded: false },
  { id: 'f5', propertyName: 'Baga Beachfront Hotel', state: 'Goa', district: 'North Goa', location: 'Baga', closingAmount: 95000, pendingAmount: 95000, collectedAmount: 0, invoiceUploaded: false },
  { id: 'f6', propertyName: 'Beypore Cottage Stay', state: 'Kerala', district: 'Kozhikode', location: 'Beypore', closingAmount: 30000, pendingAmount: 15000, collectedAmount: 15000, invoiceUploaded: true, invoiceDate: '2026-02-10', lastPaymentDate: '2026-02-20' },
]

export const financeStats = {
  totalClosingAmount: 743000,
  pendingAmount: 293000,
  collectedAmount: 450000,
}

export const dailyRevenueData = [
  { day: 'Mon', revenue: 45000 },
  { day: 'Tue', revenue: 52000 },
  { day: 'Wed', revenue: 38000 },
  { day: 'Thu', revenue: 65000 },
  { day: 'Fri', revenue: 48000 },
  { day: 'Sat', revenue: 72000 },
  { day: 'Sun', revenue: 31000 },
]

export const weeklyRevenueData = [
  { week: 'W1', revenue: 280000 },
  { week: 'W2', revenue: 345000 },
  { week: 'W3', revenue: 310000 },
  { week: 'W4', revenue: 425000 },
]

export const monthlyRevenueData = [
  { month: 'Oct', revenue: 520000 },
  { month: 'Nov', revenue: 680000 },
  { month: 'Dec', revenue: 750000 },
  { month: 'Jan', revenue: 890000 },
  { month: 'Feb', revenue: 620000 },
  { month: 'Mar', revenue: 950000 },
]

export interface ExpenseRecord {
  id: string
  category: 'Office Expenses' | 'Other Expenses' | 'Income'
  description: string
  amount: number
  date: string
}

export const expenses: ExpenseRecord[] = [
  { id: 'e1', category: 'Office Expenses', description: 'Office rent - March', amount: 45000, date: '2026-03-01' },
  { id: 'e2', category: 'Office Expenses', description: 'Internet & utilities', amount: 8500, date: '2026-03-05' },
  { id: 'e3', category: 'Other Expenses', description: 'Travel reimbursement - Anil', amount: 12000, date: '2026-03-08' },
  { id: 'e4', category: 'Other Expenses', description: 'Trade fair booth - Kerala Tourism', amount: 25000, date: '2026-03-10' },
  { id: 'e5', category: 'Income', description: 'Subscription - Ocean Breeze Resort', amount: 135000, date: '2026-03-01' },
  { id: 'e6', category: 'Income', description: 'Subscription - Kappad Heritage Inn', amount: 50000, date: '2026-02-01' },
]

// ---------- Travel Agents ----------
export type ContractType = 'Platinum' | 'Gold' | 'Silver' | 'Bronze'

export interface TravelAgent {
  id: string
  agentName: string
  contactNumber: string
  email: string
  trialStatus: boolean
  trialRemainingDays: number
  planStartDate: string
  planEndDate: string
  pendingAmount: number
  collectedAmount: number
  contractType: ContractType
  state: string
  district: string
  location: string
}

export const travelAgents: TravelAgent[] = [
  { id: 'ta1', agentName: 'Kerala Holidays Pvt Ltd', contactNumber: '+91 94567 12345', email: 'contact@keralaholidays.com', trialStatus: false, trialRemainingDays: 0, planStartDate: '2025-06-01', planEndDate: '2026-05-31', pendingAmount: 15000, collectedAmount: 85000, contractType: 'Platinum', state: 'Kerala', district: 'Kozhikode', location: 'Calicut Beach' },
  { id: 'ta2', agentName: 'Malabar Travels', contactNumber: '+91 85678 23456', email: 'info@malabartravels.in', trialStatus: true, trialRemainingDays: 12, planStartDate: '2026-03-01', planEndDate: '2026-03-31', pendingAmount: 0, collectedAmount: 0, contractType: 'Bronze', state: 'Kerala', district: 'Kozhikode', location: 'Kappad' },
  { id: 'ta3', agentName: 'Cochin Adventures', contactNumber: '+91 76789 34567', email: 'book@cochinadventures.com', trialStatus: false, trialRemainingDays: 0, planStartDate: '2025-09-15', planEndDate: '2026-09-14', pendingAmount: 25000, collectedAmount: 75000, contractType: 'Gold', state: 'Kerala', district: 'Ernakulam', location: 'Fort Kochi' },
  { id: 'ta4', agentName: 'South India Tours', contactNumber: '+91 98901 45678', email: 'hello@southindiatours.com', trialStatus: true, trialRemainingDays: 5, planStartDate: '2026-02-20', planEndDate: '2026-03-20', pendingAmount: 0, collectedAmount: 0, contractType: 'Silver', state: 'Kerala', district: 'Trivandrum', location: 'Kovalam' },
  { id: 'ta5', agentName: 'Goa Beach Holidays', contactNumber: '+91 87012 56789', email: 'info@goabeachholidays.com', trialStatus: false, trialRemainingDays: 0, planStartDate: '2025-12-01', planEndDate: '2026-11-30', pendingAmount: 30000, collectedAmount: 70000, contractType: 'Gold', state: 'Goa', district: 'North Goa', location: 'Baga' },
  { id: 'ta6', agentName: 'KTM Holidays', contactNumber: '+91 94432 11223', email: 'ops@ktmholidays.in', trialStatus: true, trialRemainingDays: 20, planStartDate: '2026-03-10', planEndDate: '2026-04-10', pendingAmount: 0, collectedAmount: 0, contractType: 'Bronze', state: 'Kerala', district: 'Ernakulam', location: 'Marine Drive' },
]

// ---------- Trade Fairs ----------
export interface TradeFairVenue {
  id: string
  location: string
  city: string
  venue: string
  date: string
}

export const tradeFairVenues: TradeFairVenue[] = [
  { id: 'tf1', location: 'Kerala', city: 'Kochi', venue: 'Lulu Convention Centre', date: '2026-04-15' },
  { id: 'tf2', location: 'Goa', city: 'Panaji', venue: 'Kala Academy', date: '2026-05-10' },
  { id: 'tf3', location: 'Karnataka', city: 'Bangalore', venue: 'BIEC', date: '2026-06-20' },
]

export type TradeFairStatus = 'Interested' | 'Requested Demo' | 'Connected' | 'Closed' | 'Payment Done'

export interface TradeFairProperty {
  id: string
  fairId: string
  propertyName: string
  contactPerson: string
  contactNumber: string
  email: string
  location: string
  status: TradeFairStatus
}

export const tradeFairProperties: TradeFairProperty[] = [
  { id: 'tfp1', fairId: 'tf1', propertyName: 'Alleppey Houseboat Resort', contactPerson: 'Manoj V', contactNumber: '+91 94567 88001', email: 'info@alleppeyhouseboat.com', location: 'Alleppey', status: 'Closed' },
  { id: 'tfp2', fairId: 'tf1', propertyName: 'Wayanad Hill Retreat', contactPerson: 'Asha Mohan', contactNumber: '+91 85678 77002', email: 'reservations@wayanadhill.com', location: 'Wayanad', status: 'Requested Demo' },
  { id: 'tfp3', fairId: 'tf1', propertyName: 'Thekkady Spice Village', contactPerson: 'George K', contactNumber: '+91 76789 66003', email: 'stay@spicevillage.in', location: 'Thekkady', status: 'Connected' },
  { id: 'tfp4', fairId: 'tf2', propertyName: 'Goa Heritage Villa', contactPerson: 'Maria F', contactNumber: '+91 83214 55004', email: 'book@goaheritage.com', location: 'Old Goa', status: 'Interested' },
  { id: 'tfp5', fairId: 'tf3', propertyName: 'Coorg Coffee Estate Stay', contactPerson: 'Kavitha R', contactNumber: '+91 94321 44005', email: 'stay@coorgcoffee.com', location: 'Coorg', status: 'Payment Done' },
]

export interface TradeFairAgent {
  id: string
  fairId: string
  agentName: string
  contactNumber: string
  email: string
  location: string
  isDMC: boolean
  status: TradeFairStatus
}

export const tradeFairAgents: TradeFairAgent[] = [
  { id: 'tfa1', fairId: 'tf1', agentName: 'Thomas Cook India', contactNumber: '+91 98765 11001', email: 'info@thomascook.in', location: 'Mumbai', isDMC: true, status: 'Connected' },
  { id: 'tfa2', fairId: 'tf1', agentName: 'MakeMyTrip B2B', contactNumber: '+91 87654 22002', email: 'b2b@makemytrip.com', location: 'Delhi', isDMC: false, status: 'Interested' },
  { id: 'tfa3', fairId: 'tf2', agentName: 'Goa Concierge', contactNumber: '+91 76543 33003', email: 'team@goaconcierge.com', location: 'Panaji', isDMC: true, status: 'Closed' },
  { id: 'tfa4', fairId: 'tf3', agentName: 'Karnataka Tours', contactNumber: '+91 94432 44004', email: 'ops@karnataka-tours.com', location: 'Bangalore', isDMC: false, status: 'Requested Demo' },
]

// ---------- Sales ----------
export type SalesStatus = 'Closed' | 'Installation Pending' | 'Interested' | 'Not Interested' | 'Rescheduled' | 'Under Maintenance'

export interface SalesRecord {
  id: string
  slno: number
  propertyName: string
  numberOfRooms: number
  email: string
  primaryContactPerson: string
  designation: string
  proposedPrice: number
  planType: '6 Month' | '1 Year'
  status: SalesStatus
  comments: string
  demoProvided: boolean
  trialProvided: boolean
  installed: boolean
  executive: string
  state: string
  district: string
  location: string
}

export const salesRecords: SalesRecord[] = [
  { id: 's1', slno: 1, propertyName: 'Ocean Breeze Resort', numberOfRooms: 45, email: 'info@oceanbreeze.com', primaryContactPerson: 'Rajesh Kumar', designation: 'Manager', proposedPrice: 150000, planType: '1 Year', status: 'Closed', comments: 'Premium client. Full OTA integration done.', demoProvided: true, trialProvided: true, installed: true, executive: 'Anil Menon', state: 'Kerala', district: 'Kozhikode', location: 'Calicut Beach' },
  { id: 's2', slno: 2, propertyName: 'Kappad Heritage Inn', numberOfRooms: 18, email: 'book@kappadinn.in', primaryContactPerson: 'Priya Nair', designation: 'Owner', proposedPrice: 85000, planType: '1 Year', status: 'Closed', comments: 'Smooth onboarding.', demoProvided: true, trialProvided: false, installed: true, executive: 'Deepa S', state: 'Kerala', district: 'Kozhikode', location: 'Kappad' },
  { id: 's3', slno: 3, propertyName: 'Marine Drive Suites', numberOfRooms: 28, email: 'info@marinedrivesuites.com', primaryContactPerson: 'Meera Krishnan', designation: 'Front Office', proposedPrice: 120000, planType: '1 Year', status: 'Interested', comments: 'Evaluating competitors. Follow up in 2 weeks.', demoProvided: true, trialProvided: true, installed: false, executive: 'Rajan K', state: 'Kerala', district: 'Ernakulam', location: 'Marine Drive' },
  { id: 's4', slno: 4, propertyName: 'Whitefield Business Lodging', numberOfRooms: 16, email: 'book@wflodging.in', primaryContactPerson: 'Kavitha M', designation: 'HR', proposedPrice: 55000, planType: '6 Month', status: 'Rescheduled', comments: 'Budget constraints. April follow-up.', demoProvided: true, trialProvided: false, installed: false, executive: 'Vishal P', state: 'Karnataka', district: 'Bangalore', location: 'Whitefield' },
  { id: 's5', slno: 5, propertyName: 'Palolem Beach Resort', numberOfRooms: 32, email: 'info@palolemresort.com', primaryContactPerson: 'Carlos M', designation: 'Owner', proposedPrice: 130000, planType: '1 Year', status: 'Not Interested', comments: 'Using competitor. Not switching.', demoProvided: true, trialProvided: false, installed: false, executive: 'Anil Menon', state: 'Goa', district: 'South Goa', location: 'Palolem' },
  { id: 's6', slno: 6, propertyName: 'Fort Kochi Grand Hotel', numberOfRooms: 72, email: 'reservations@fkgrand.com', primaryContactPerson: 'Anitha George', designation: 'Manager', proposedPrice: 250000, planType: '1 Year', status: 'Closed', comments: 'Enterprise client.', demoProvided: true, trialProvided: true, installed: true, executive: 'Anil Menon', state: 'Kerala', district: 'Ernakulam', location: 'Fort Kochi' },
  { id: 's7', slno: 7, propertyName: 'Baga Beachfront Hotel', numberOfRooms: 25, email: 'info@bagabeachfront.com', primaryContactPerson: "Rahul D'Souza", designation: 'Owner', proposedPrice: 110000, planType: '1 Year', status: 'Installation Pending', comments: 'Payment done. Awaiting setup.', demoProvided: true, trialProvided: true, installed: false, executive: 'Anil Menon', state: 'Goa', district: 'North Goa', location: 'Baga' },
]

// ---------- Executive ----------
export interface Executive {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  closings: number
  revenueGenerated: number
  demosGiven: number
  trialsProvided: number
  todayVisits: number
  todayRevenue: number
  todayClosings: number
}

export const executives: Executive[] = [
  { id: 'ex1', name: 'Anil Menon', email: 'anil@bookito.in', avatar: 'AM', role: 'Senior Sales Executive', closings: 28, revenueGenerated: 3250000, demosGiven: 45, trialsProvided: 18, todayVisits: 3, todayRevenue: 135000, todayClosings: 1 },
  { id: 'ex2', name: 'Deepa S', email: 'deepa@bookito.in', avatar: 'DS', role: 'Sales Executive', closings: 22, revenueGenerated: 2870000, demosGiven: 38, trialsProvided: 15, todayVisits: 2, todayRevenue: 0, todayClosings: 0 },
  { id: 'ex3', name: 'Rajan K', email: 'rajan@bookito.in', avatar: 'RK', role: 'Sales Executive', closings: 19, revenueGenerated: 2150000, demosGiven: 32, trialsProvided: 12, todayVisits: 4, todayRevenue: 85000, todayClosings: 1 },
  { id: 'ex4', name: 'Meera Nair', email: 'meera@bookito.in', avatar: 'MN', role: 'Junior Sales Executive', closings: 15, revenueGenerated: 1780000, demosGiven: 28, trialsProvided: 10, todayVisits: 1, todayRevenue: 0, todayClosings: 0 },
  { id: 'ex5', name: 'Vishal P', email: 'vishal@bookito.in', avatar: 'VP', role: 'Junior Sales Executive', closings: 12, revenueGenerated: 1400000, demosGiven: 22, trialsProvided: 8, todayVisits: 2, todayRevenue: 55000, todayClosings: 0 },
]

// ---------- Notifications ----------
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  time: string
  read: boolean
}

export const notifications: Notification[] = [
  { id: 'n1', title: 'Plan Expiry Alert', message: 'Kovalam Beach Resort plan expires in 4 days', type: 'warning', time: '2 hours ago', read: false },
  { id: 'n2', title: 'New Closing', message: 'Anil Menon closed Ocean Breeze Resort for ₹1,35,000', type: 'success', time: '3 hours ago', read: false },
  { id: 'n3', title: 'Payment Received', message: 'Kappad Heritage Inn paid ₹50,000', type: 'success', time: '5 hours ago', read: true },
  { id: 'n4', title: 'Demo Scheduled', message: 'Marine Drive Suites demo scheduled for tomorrow', type: 'info', time: '6 hours ago', read: true },
  { id: 'n5', title: 'Feature Update', message: 'Channel Manager v2.5 released with Airbnb integration', type: 'info', time: 'Yesterday', read: false },
  { id: 'n6', title: 'Bug Report', message: 'Agent portal login issue reported by Kerala Holidays', type: 'error', time: 'Yesterday', read: true },
]

// ---------- Feature List ----------
export interface Feature {
  id: string
  name: string
  description: string
  version: string
  date: string
}

export const features: Feature[] = [
  { id: 'feat1', name: 'Channel Manager v2.5', description: 'Airbnb integration, real-time sync, bulk rate update', version: '2.5.0', date: '2026-03-10' },
  { id: 'feat2', name: 'OTA Dashboard', description: 'Unified OTA performance dashboard with analytics', version: '2.4.0', date: '2026-02-28' },
  { id: 'feat3', name: 'Smart Pricing', description: 'AI-powered dynamic pricing suggestions', version: '2.3.0', date: '2026-02-15' },
  { id: 'feat4', name: 'Guest Reviews', description: 'Centralized review management across all OTAs', version: '2.2.0', date: '2026-01-30' },
]
