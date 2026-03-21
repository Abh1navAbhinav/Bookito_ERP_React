### Bookito ERP React – Project Summary

This project is a **React + TypeScript + Vite** front‑end for an ERP‑style dashboard focused on the Bookito domain (property management, finance, HR, sales, travel agents, and trade fairs). It is a single‑page application using **React Router** for navigation, **Tailwind CSS** for styling, and a set of reusable UI primitives built on Radix UI, Lucide icons, TanStack Table, and Recharts.

### Tech Stack
- **Framework**: React 19 (with StrictMode) + TypeScript
- **Build tooling**: Vite 8, TypeScript project refs (`tsconfig.app.json`, `tsconfig.node.json`)
- **Routing**: `react-router-dom` (BrowserRouter, nested routes, `Outlet`)
- **UI / Styling**:
  - Tailwind CSS 4 with utility classes and semantic color tokens (e.g. `bg-surface-50`, `text-primary-600`)
  - Custom layout components: `DashboardLayout`, `Sidebar`, `Topbar`, `PageBreadcrumb`
  - Radix UI primitives (`@radix-ui/react-dialog`, dropdown, popover, select, tabs, slot)
  - Lucide icons for consistent iconography
- **Data display & charts**:
  - `@tanstack/react-table` via a reusable `DataTable` component
  - `recharts` for area, bar, and pie charts across dashboards
- **Utilities**:
  - `clsx` + `tailwind-merge` via `cn()` helper
  - `date-fns` for date handling
  - `react-to-print` for PDF/print flows (e.g. quotations)

### High‑Level Architecture
- **Entry point**: `main.tsx` renders `<App />` into `#root` with React StrictMode, importing global styles from `index.css`.
- **Routing shell**: `App.tsx` configures all application routes using `BrowserRouter` and wraps most of them inside `DashboardLayout`, which provides:
  - **Protected routes**: If there is no `bookito_access_token`, the app redirects to `/login` and stores the current path in `location.state.from`; after successful login, the user is sent to that path when present.
  - Left `Sidebar` navigation
  - Top `Topbar` (global controls, user context, notifications from API)
  - `PageBreadcrumb` + main content area driven by `Outlet`
  - Automatic scroll‑to‑top on route change
- **Feature areas** (all under `src/pages`):
  - **Dashboard**
    - `DashboardPage`: Company‑level KPIs (properties, revenue, payments, agents, sales, plan expiries) backed by live backend APIs (reports, finance, sales, properties). Uses `StatsCard`, `ChartCard`, and multiple Recharts visualizations (revenue vs target, sales performance, property distribution, closing vs pending).
    - `ExecutiveDashboardPage`: Executive‑oriented view that pulls executives and sales pipeline data from backend reports and sales APIs (no mock data).
  - **Properties**
    - `PropertiesPage`: Listing and management of properties (e.g. hotels/resorts) backed by the `/api/properties/` endpoint plus config and sales APIs; integrates with finance and quotations.
    - `PropertyDetailsPage`: Detail view of a single property, including commercial terms and visit history fetched from the backend.
  - **Finance**
    - `FinancePage`: Rich finance workspace that:
      - Tracks **quotations**, **payment records**, and **expenses** via finance APIs (`/api/finance/quotations/`, `/api/finance/payments/`, `/api/finance/expenses/`) and report summaries.
      - Uses role context from `localStorage` (`bookito_demo_user.role` – e.g. manager, accountant) to gate sensitive actions like editing payments or adding expenses.
      - Provides **quotation creation & editing** flows with:
        - Property selection (`SearchableSelect`) that auto‑fills key commercial fields.
        - Executive details (name, role, phone) and discount calculation.
        - Live preview through `QuotationDocument` and PDF export via `react-to-print`.
      - Provides **billing / payment** flows:
        - Convert a quotation into a bill, update property financials, and create a new finance record.
        - Track closing, collected, and pending amounts, plus invoice upload status and last payment date.
        - Soft‑delete payments with a trash tab and auto‑delete countdown (30‑day retention).
      - Provides **expense management** (for accountants):
        - Create/edit/delete expenses with categories (office, other, income), amounts, and dates.
        - Visual differentiation of income vs expense via `StatusBadge` and color coding.
        - Deleted expenses are also soft‑deleted with a 30‑day retention indicator.
      - Advanced **filtering and segmentation**:
        - Built‑in filters for payment/quotation status, executives, and tabs (active vs deleted).
        - Custom, user‑defined filters stored in arrays and surfaced as removable chips in the UI.
      - **Analytics section**:
        - Revenue overview with daily/weekly/monthly toggles (preconfigured datasets) rendered via Recharts area charts.
    - Additional finance views: `FinanceDashboard`, `QuotationsPage`, `InvoicesPage`, `ExpensesPage`, `VendorsPage`, `TaxationPage` — and the main **`FinancePage`** workspace — use **`@/lib/financeApi`** (`guardedFetch`) for quotations, payments, and expenses (including merged active + trash lists, same as standalone pages).
  - **HR (Human Resources)**
    - `HrDashboard`: HR overview backed by backend APIs (`/api/hr/employees/`, `/api/hr/attendance/`, `/api/hr/leaves/`); KPIs, department distribution, and attendance trends from live data.
      - KPI tiles: total employees, present today, on leave, new joinees.
      - Attendance trends bar chart (weekly) and department‑wise distribution pie chart.
      - Recent HR activities feed (hires, leaves, attendance issues).
      - Quick action shortcuts (add employee, schedule interview, run payroll).
    - Other HR modules:
      - `HrUsersPage` (account CRUD + trash via `/api/accounts/users/`, no `bookito_hr_users` localStorage)
      - `HrAttendancePage`, `AttendanceDashboard`
      - `EmployeeListPage` (employee management)
      - `LeaveRequestsPage` (leave workflows)
      - `PayrollProcessingPage` (payroll)
      - `JobPostingsPage`, `PerformanceReviewsPage`, `TrainingProgramsPage`, `ExitManagementPage` — backed by `/api/hr/*` ViewSets with soft‑delete + seeds (no HR module localStorage).
      - `EmployeeSelfServicePage` (ESS): payslips + leave requests via `/api/hr/ess/payslips/` and `/api/hr/ess/leaves/`. Seeds create sample rows for **all** demo tile users (`manager_demo`, `sales_demo`, `accountant_demo`, `crm_demo`, `hr_demo`); no `ess_*` localStorage.
      - `HrReportsPage`
  - **Sales**
    - `SalesAttendancePage`: Sales‑oriented attendance or field tracking (route `/attendance`).
  - **Travel Agents & Trade Fairs**
    - `TravelAgentsPage` and `TravelAgentDetailsPage`: Manage and inspect travel agents linked to properties and sales via partners APIs and config‑driven location hierarchy.
    - `TradeFairsPage`, `TradeFairPropertyDetailsPage`, `TradeFairAgentDetailsPage`, `TradeFairCardLeadForm`: Manage trade fair participation, associated properties, and leads, using partners APIs and shared config.
  - **Admin**
    - `AdminFeaturesPage` and `FeatureDetailsPage`: Feature catalogue backed by `/api/accounts/catalogue-features/` (`CatalogueFeature` model + seeds), replacing `bookito_features_catalogue` localStorage.
  - **Pricing & Reports**
    - `PricingPlanPage`: Commercial/pricing plans for the ERP offering.
    - `ReportsPage`: Aggregated reporting interface (finance/HR/sales) built from reused cards and tables.
  - **Auth**
    - `LoginPage`: Entry point at `/login`; POST email + password to `/api/accounts/login/`, stores JWT tokens and session user in `localStorage` (`bookito_demo_user` for role/label). Logout clears tokens and calls `/api/accounts/logout/`.

### Shared Components & Utilities
- **Layout**
  - `DashboardLayout`: Top‑level shell with sidebar, topbar, breadcrumbs, and main content slot. Keeps a constant left margin equal to the collapsed sidebar width to avoid content jumps on hover expansion.
  - `Sidebar`: Global navigation among modules (dashboard, properties, finance, etc.).
  - `Topbar`: Global header region (user actions, search, etc.).
- **Cards & visual elements**
  - `StatsCard`: KPI/value card with icon, trend indicator, variant styles (primary, accent, warning, danger).
  - `ChartCard`: Wrapper around Recharts visuals with title, subtitle, and optional actions (e.g. time range toggles).
  - `StatusBadge`: Status pill with variants (success, warning, info, danger) and optional dot indicator.
- **Data handling**
  - `DataTable`: Generic, opinionated table abstraction over TanStack Table:
    - Global search, column sorting, pagination, and sticky action column.
    - Column visibility management with a dropdown column picker.
    - Optional row click handler for navigations or detail views.
  - `FolderNavigator`: File/folder navigation helper (likely used in reports or document sections).
- **Documents & printing**
  - `QuotationDocument`, `BillDocument`, `ExpenseDocument`: Structured document components used for print/PDF flows.
  - Integrated with `react-to-print` to support user‑initiated downloads.
- **Form primitives**
  - `FormElements`: Central collection of form controls (`Button`, `Input`, `Select`, `SearchableSelect`, `FormField`, etc.) styled to match the dashboard.
  - Several modals built on Radix Dialog (`AddPropertyModal`, `AddAgentModal`, `SelfieCaptureModal`, plus the finance/quotation/expense/payment modals defined in feature pages).

### State & Data Model
- **Backend‑driven data**:
  - Properties, sales records, finance records, quotations, expenses, executives, and dashboard metrics come from Django REST APIs (`/api/properties/`, `/api/sales/`, `/api/finance/`, `/api/reports/`, `/api/partners/`, `/api/hr/`).
  - Config endpoint (`/api/reports/config/`) provides dropdown options and a **full India state → district** `location_hierarchy` (loaded from `backend/apps/reports/data/india_location_hierarchy.json`, generated from Wikipedia; see `data/README.md`). Notifications come from `/api/accounts/notifications/` and are shown in the Topbar.
  - **Subscription plans**: `GET/POST /api/subscriptions/plans/`, `PATCH /api/subscriptions/plans/<id>/`, soft-delete and restore actions. Seeded with Standard / Premium / PRO (`apps.subscriptions.seeds`). The **Pricing Plan** page (`/pricing-plan`) loads and saves via this API (managers/admins can create, edit, trash, restore).
- **Auth and 401 handling**:
  - All authenticated API calls use `guardedFetch` from `src/lib/auth.ts`, which adds the access token and, on 401, tries a single token refresh via `/api/accounts/token/refresh/`; on success it retries the request; on failure or a second 401 it clears tokens and redirects to `/login`.
- **Local persistence**:
  - Role and demo user are stored in `localStorage` under `bookito_demo_user` for RBAC. Some HR modules (e.g. job postings, performance, training, exit, ESS) still use `localStorage` where no backend API exists.
- **Soft delete pattern**:
  - Finance and expense entities implement soft deletion with an `isDeleted` flag and `deletedAt` timestamp.
  - Tabs switch between active and trash views, and a countdown (`getRemainingDays`) shows days until auto‑deletion (30‑day retention).

### Routing Overview
- Public route:
  - `/login` → `LoginPage`
- Protected/dashboard shell (`DashboardLayout`) routes:
  - `/` → `DashboardPage`
  - `/executive-dashboard` → `ExecutiveDashboardPage`
  - `/properties`, `/properties/:id` → property listing & details
  - `/finance` + nested finance pages (`/finance/dashboard`, `/finance/quotations`, `/finance/invoices`, `/finance/expenses`, `/finance/vendors`, `/finance/taxation`)
  - `/travel-agents`, `/travel-agents/:id`
  - `/trade-fairs`, `/trade-fairs/property/:id`, `/trade-fairs/agent/:id`
  - `/pricing-plan`
  - `/reports`
  - `/admin/features`, `/admin/features/:id`
  - `/hr/dashboard`, `/hr/employees`, `/hr/attendance`, `/hr/attendance-v2`, `/hr/leaves`, `/hr/payroll`, `/hr/recruitment`, `/hr/performance`, `/hr/training`, `/hr/exit`, `/hr/ess`, `/hr/reports`, `/hr/users`
  - `/attendance` (sales attendance)

### Developer Experience & Scripts
- **NPM scripts**:
  - `dev`: Run Vite dev server.
  - `build`: Type‑check (`tsc -b`) then build Vite assets.
  - `lint`: Run ESLint across the project.
  - `preview`: Serve the production build locally.
- **Linting**:
  - ESLint 9 with `@eslint/js`, `typescript-eslint`, and React‑specific plugins (`eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`).
  - The default README notes an upgrade path to type‑aware configs and additional React plugins (`eslint-plugin-react-x`, `eslint-plugin-react-dom`).

### How to Run
1. **Frontend**
   - Install dependencies: `npm install`
   - Start the dev server: `npm run dev`
   - Access the app (e.g. `http://localhost:5173`).
2. **Backend** (for full API and notifications)
   - From the `backend` directory, activate your virtualenv, then run:
     - `python manage.py migrate`
     - `python manage.py seed_data`
   - This applies migrations (including the Notification model) and seeds demo data; the Topbar notifications API and other endpoints will then work.
3. **Testing**
   - Unit tests use **Vitest** (with `jsdom`). Run: `npm run test`. Tests cover auth helpers (`getAuthHeaders`, `clearAuthAndRedirectToLogin`) and utils (`cn`, `formatCurrency`, `formatNumber`).

### Intended Use & Demo Flow
- The app is designed as a **demo ERP front‑end** showcasing:
  - Integrated views of properties, finance, HR, and sales in a single, cohesive dashboard, with data from the Django backend.
  - Role‑based behavior (via demo login and `bookito_demo_user`) and JWT auth with optional token refresh.
  - Modern UX patterns: soft deletion, custom filters, responsive cards, analytics charts, and document/PDF workflows.
- A typical exploration flow:
  - Log in via `LoginPage`, then review `DashboardPage` for high‑level KPIs.
  - Navigate to **Properties** to explore the portfolio.
  - Use **Finance** to:
    - Generate a quotation for a property,
    - Convert it into a bill and payment record,
    - Track collections and pending amounts,
    - Record expenses (as an accountant).
  - Switch to **HR** dashboards for workforce insights and attendance trends.
  - Visit **Travel Agents** and **Trade Fairs** to see how external partners and events are linked to property sales.

