import { getAuthHeaders, guardedFetch } from '@/lib/auth'
import { ensureOk } from '@/lib/apiErrors'

const apiBase =
  (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ??
  'http://localhost:8000'

export function getHrAuthHeaders(): Record<string, string> {
  return getAuthHeaders()
}

async function get<T>(path: string): Promise<T> {
  const res = await guardedFetch(`${apiBase}${path}`)
  await ensureOk(res, 'HR request failed')
  return res.json() as Promise<T>
}

async function post(path: string, body: unknown): Promise<unknown> {
  const res = await guardedFetch(`${apiBase}${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  await ensureOk(res, 'HR request failed')
  return res.status === 204 ? undefined : res.json()
}

async function patch(path: string, body: unknown): Promise<unknown> {
  const res = await guardedFetch(`${apiBase}${path}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
  await ensureOk(res, 'HR request failed')
  return res.status === 204 ? undefined : res.json()
}

type Paginated<T> = { results: T[] } | T[]

function asList<T>(data: Paginated<T>): T[] {
  return Array.isArray(data) ? data : (data as { results: T[] }).results ?? []
}

// Employees
export interface ApiEmployee {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  department: string
  designation: string
  date_of_joining: string
  status: string
  deleted_at?: string | null
}

export async function fetchEmployees(): Promise<ApiEmployee[]> {
  const data = await get<Paginated<ApiEmployee>>('/api/hr/employees/')
  return asList(data)
}

export async function fetchDeletedEmployees(): Promise<ApiEmployee[]> {
  const data = await get<Paginated<ApiEmployee>>('/api/hr/employees/deleted/')
  return asList(data)
}

export async function createEmployee(payload: {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  department: string
  designation: string
  date_of_joining: string
  status: string
}): Promise<ApiEmployee> {
  return post('/api/hr/employees/', payload) as Promise<ApiEmployee>
}

export async function softDeleteEmployee(id: string): Promise<void> {
  await post(`/api/hr/employees/${id}/soft-delete/`, {})
}

export async function restoreEmployee(id: string): Promise<void> {
  await post(`/api/hr/employees/${id}/restore/`, {})
}

// Attendance
export interface ApiAttendance {
  id: string
  employee: string
  employee_name: string
  date: string
  status: string
  check_in_time: string | null
  check_out_time: string | null
  notes: string
  deleted_at?: string | null
}

export async function fetchAttendance(): Promise<ApiAttendance[]> {
  const data = await get<Paginated<ApiAttendance>>('/api/hr/attendance/')
  return asList(data)
}

export async function fetchDeletedAttendance(): Promise<ApiAttendance[]> {
  const data = await get<Paginated<ApiAttendance>>('/api/hr/attendance/deleted/')
  return asList(data)
}

export async function createAttendance(payload: {
  id: string
  employee: string
  date: string
  status: string
  check_in_time?: string | null
  check_out_time?: string | null
  notes?: string
}): Promise<ApiAttendance> {
  return post('/api/hr/attendance/', payload) as Promise<ApiAttendance>
}

export async function updateAttendance(id: string, payload: Partial<ApiAttendance>): Promise<ApiAttendance> {
  return patch(`/api/hr/attendance/${id}/`, payload) as Promise<ApiAttendance>
}

export async function softDeleteAttendance(id: string): Promise<void> {
  await post(`/api/hr/attendance/${id}/soft-delete/`, {})
}

export async function restoreAttendance(id: string): Promise<void> {
  await post(`/api/hr/attendance/${id}/restore/`, {})
}

// Leaves
export interface ApiLeave {
  id: string
  employee: string
  employee_name: string
  start_date: string
  end_date: string
  reason: string
  status: string
  deleted_at?: string | null
}

export async function fetchLeaves(): Promise<ApiLeave[]> {
  const data = await get<Paginated<ApiLeave>>('/api/hr/leaves/')
  return asList(data)
}

export async function fetchDeletedLeaves(): Promise<ApiLeave[]> {
  const data = await get<Paginated<ApiLeave>>('/api/hr/leaves/deleted/')
  return asList(data)
}

export async function createLeave(payload: {
  id: string
  employee: string
  start_date: string
  end_date: string
  reason: string
  status?: string
}): Promise<ApiLeave> {
  return post('/api/hr/leaves/', payload) as Promise<ApiLeave>
}

export async function updateLeave(id: string, payload: { status: string }): Promise<ApiLeave> {
  return patch(`/api/hr/leaves/${id}/`, payload) as Promise<ApiLeave>
}

export async function softDeleteLeave(id: string): Promise<void> {
  await post(`/api/hr/leaves/${id}/soft-delete/`, {})
}

export async function restoreLeave(id: string): Promise<void> {
  await post(`/api/hr/leaves/${id}/restore/`, {})
}

// Payroll
export interface ApiPayroll {
  id: string
  employee: string
  employee_name: string
  month: string
  basic_salary: string
  allowances: string
  deductions: string
  net_salary: string
  deleted_at?: string | null
}

export async function fetchPayroll(): Promise<ApiPayroll[]> {
  const data = await get<Paginated<ApiPayroll>>('/api/hr/payroll/')
  return asList(data)
}

export async function fetchDeletedPayroll(): Promise<ApiPayroll[]> {
  const data = await get<Paginated<ApiPayroll>>('/api/hr/payroll/deleted/')
  return asList(data)
}

export async function softDeletePayroll(id: string): Promise<void> {
  await post(`/api/hr/payroll/${id}/soft-delete/`, {})
}

export async function restorePayroll(id: string): Promise<void> {
  await post(`/api/hr/payroll/${id}/restore/`, {})
}

// ——— Exit requests ———
export interface ApiExitRequest {
  id: string
  employee_name: string
  employee_code: string
  resignation_date: string
  last_working_day: string
  status: string
  reason: string
  deleted_at?: string | null
}

export async function fetchExitRequests(): Promise<ApiExitRequest[]> {
  const data = await get<Paginated<ApiExitRequest>>('/api/hr/exit-requests/')
  return asList(data)
}

export async function fetchDeletedExitRequests(): Promise<ApiExitRequest[]> {
  const data = await get<Paginated<ApiExitRequest>>('/api/hr/exit-requests/deleted/')
  return asList(data)
}

export async function createExitRequest(body: Record<string, unknown>): Promise<ApiExitRequest> {
  return post('/api/hr/exit-requests/', body) as Promise<ApiExitRequest>
}

export async function patchExitRequest(
  id: string,
  body: Record<string, unknown>
): Promise<ApiExitRequest> {
  return patch(`/api/hr/exit-requests/${id}/`, body) as Promise<ApiExitRequest>
}

export async function softDeleteExitRequest(id: string): Promise<void> {
  await post(`/api/hr/exit-requests/${id}/soft-delete/`, {})
}

export async function restoreExitRequest(id: string): Promise<ApiExitRequest> {
  return post(`/api/hr/exit-requests/${id}/restore/`, {}) as Promise<ApiExitRequest>
}

// ——— Job postings ———
export interface ApiJobPosting {
  id: string
  title: string
  department: string
  location: string
  employment_type: string
  applicants: number
  posted_date: string
  status: string
  deleted_at?: string | null
}

export async function fetchJobPostings(): Promise<ApiJobPosting[]> {
  const data = await get<Paginated<ApiJobPosting>>('/api/hr/job-postings/')
  return asList(data)
}

export async function fetchDeletedJobPostings(): Promise<ApiJobPosting[]> {
  const data = await get<Paginated<ApiJobPosting>>('/api/hr/job-postings/deleted/')
  return asList(data)
}

export async function createJobPosting(body: Record<string, unknown>): Promise<ApiJobPosting> {
  return post('/api/hr/job-postings/', body) as Promise<ApiJobPosting>
}

export async function softDeleteJobPosting(id: string): Promise<void> {
  await post(`/api/hr/job-postings/${id}/soft-delete/`, {})
}

export async function restoreJobPosting(id: string): Promise<ApiJobPosting> {
  return post(`/api/hr/job-postings/${id}/restore/`, {}) as Promise<ApiJobPosting>
}

// ——— Training programs ———
export interface ApiTrainingProgram {
  id: string
  title: string
  instructor: string
  employees_enrolled: number
  completion_rate: string
  start_date: string
  status: string
  deleted_at?: string | null
}

export async function fetchTrainingPrograms(): Promise<ApiTrainingProgram[]> {
  const data = await get<Paginated<ApiTrainingProgram>>('/api/hr/training-programs/')
  return asList(data)
}

export async function fetchDeletedTrainingPrograms(): Promise<ApiTrainingProgram[]> {
  const data = await get<Paginated<ApiTrainingProgram>>('/api/hr/training-programs/deleted/')
  return asList(data)
}

export async function createTrainingProgram(
  body: Record<string, unknown>
): Promise<ApiTrainingProgram> {
  return post('/api/hr/training-programs/', body) as Promise<ApiTrainingProgram>
}

export async function softDeleteTrainingProgram(id: string): Promise<void> {
  await post(`/api/hr/training-programs/${id}/soft-delete/`, {})
}

export async function restoreTrainingProgram(id: string): Promise<ApiTrainingProgram> {
  return post(`/api/hr/training-programs/${id}/restore/`, {}) as Promise<ApiTrainingProgram>
}

// ——— Performance reviews ———
export interface ApiPerformanceReview {
  id: string
  employee_name: string
  employee_code: string
  review_period: string
  rating: string
  reviewer: string
  status: string
  deleted_at?: string | null
}

export async function fetchPerformanceReviews(): Promise<ApiPerformanceReview[]> {
  const data = await get<Paginated<ApiPerformanceReview>>('/api/hr/performance-reviews/')
  return asList(data)
}

export async function fetchDeletedPerformanceReviews(): Promise<ApiPerformanceReview[]> {
  const data = await get<Paginated<ApiPerformanceReview>>('/api/hr/performance-reviews/deleted/')
  return asList(data)
}

export async function createPerformanceReview(
  body: Record<string, unknown>
): Promise<ApiPerformanceReview> {
  return post('/api/hr/performance-reviews/', body) as Promise<ApiPerformanceReview>
}

export async function softDeletePerformanceReview(id: string): Promise<void> {
  await post(`/api/hr/performance-reviews/${id}/soft-delete/`, {})
}

export async function restorePerformanceReview(id: string): Promise<ApiPerformanceReview> {
  return post(`/api/hr/performance-reviews/${id}/restore/`, {}) as Promise<ApiPerformanceReview>
}

// ——— ESS (self-service; scoped to current user on backend) ———
export interface ApiEssPayslip {
  id: number
  month_label: string
  net_pay: string
  status: string
}

export interface ApiEssLeave {
  id: number
  leave_type: string
  start_date: string
  end_date: string
  reason: string
  status: string
  hr_comment: string
}

export async function fetchEssPayslips(): Promise<ApiEssPayslip[]> {
  const data = await get<Paginated<ApiEssPayslip>>('/api/hr/ess/payslips/')
  return asList(data)
}

export async function fetchEssLeaves(): Promise<ApiEssLeave[]> {
  const data = await get<Paginated<ApiEssLeave>>('/api/hr/ess/leaves/')
  return asList(data)
}

export async function createEssLeave(body: {
  leave_type: string
  start_date: string
  end_date: string
  reason?: string
}): Promise<ApiEssLeave> {
  return post('/api/hr/ess/leaves/', body) as Promise<ApiEssLeave>
}

export async function patchEssLeave(id: number | string, body: Record<string, unknown>): Promise<ApiEssLeave> {
  return patch(`/api/hr/ess/leaves/${id}/`, body) as Promise<ApiEssLeave>
}
