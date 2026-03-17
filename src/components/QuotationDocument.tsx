import React from 'react'
import { MapPin, Mail, Globe } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface QuotationDocumentProps {
  recipientName: string
  propertyName: string
  roomCategory: string
  standardPrice: number
  sellingPrice: number
  tenure: string
  executiveName: string
  executiveRole: string
  executivePhone: string
}

export const QuotationDocument = React.forwardRef<HTMLDivElement, QuotationDocumentProps>(
  ({ recipientName, propertyName, roomCategory, standardPrice, sellingPrice, tenure, executiveName, executiveRole, executivePhone }, ref) => {
    const monthlyTotal = sellingPrice
    const sixMonthsTotal = monthlyTotal * 6
    const twelveMonthsTotal = monthlyTotal * 12
    const discountPercent = standardPrice > 0 ? (((standardPrice - sellingPrice) / standardPrice) * 100).toFixed(1) : 0
    const hasDiscount = Number(discountPercent) > 0

    return (
      <div 
        ref={ref} 
        className="mx-auto w-[210mm] min-h-[297mm] bg-white p-[15mm] text-surface-900 shadow-xl print:m-0 print:p-[12mm] print:shadow-none print:min-h-screen flex flex-col"
        style={{ fontFamily: "'Inter', sans-serif", pageBreakAfter: 'always' }}
      >
        {/* Header/Logo */}
        <div className="mb-8 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-emerald-600">
               Bookito
            </h1>
            <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-surface-500 uppercase">
              Book Smart . Manage Smart
            </p>
          </div>
        </div>

        {/* Brand Info */}
        <div className="mb-6 font-bold text-xs text-surface-900 uppercase">
          BOOKITO PVT LTD
        </div>

        {/* Salutation */}
        <div className="mb-5 space-y-3 text-xs leading-relaxed">
          <p>Dear Team <span className="font-bold">{recipientName}</span>,</p>
          <p>Greetings from <span className="font-bold">Bookito Pvt. Ltd.!</span></p>
          <p>
            We are pleased to share our quotation for the implementation of the <span className="font-bold">Bookito Property Management System (PMS) and Channel Manager</span> for <span className="font-bold">{propertyName}</span>. It is truly an honour for us to be associated with and support a reputed hospitality brand such as yours.
          </p>
        </div>

        {/* Quotation Details */}
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-bold underline">Quotation Details</h3>
          <ul className="ml-6 list-disc text-xs font-medium space-y-1">
            <li>Property Category: <span className="font-bold">{roomCategory}</span></li>
            <li>Standard Plan Price: {formatCurrency(standardPrice)} per month</li>
            {hasDiscount && (
              <li>
                <span className="font-bold text-emerald-600">Offered Plan Price: {formatCurrency(sellingPrice)} per month ({discountPercent}% Discount)</span>
              </li>
            )}
            <li>Quoted Tenure: <span className="font-bold">{tenure}</span></li>
          </ul>
        </div>

        {/* Quotation Table */}
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-bold underline">Quotation Table</h3>
          <table className="w-full border-collapse border border-surface-300 text-xs">
            <thead>
              <tr className="bg-surface-50">
                <th className="border border-surface-300 p-2 text-left font-bold">Description</th>
                <th className="border border-surface-300 p-2 text-left font-bold">Calculation</th>
                <th className="border border-surface-300 p-2 text-left font-bold">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-surface-300 p-2">
                  PMS & Channel Manager Charges (6 Months)
                </td>
                <td className="border border-surface-300 p-2">
                   Flat Rate for {roomCategory}
                </td>
                <td className="border border-surface-300 p-2 font-bold">
                  {formatCurrency(monthlyTotal)} / month
                </td>
              </tr>
              <tr className="bg-surface-50 font-bold text-[13px]">
                <td className="border border-surface-300 p-2 text-right" colSpan={2}>
                  Total for 6 Months
                </td>
                <td className="border border-surface-300 p-2">
                  {formatCurrency(sixMonthsTotal)}/-
                </td>
              </tr>
              <tr>
                <td className="border border-surface-300 p-2">
                  PMS & Channel Manager Charges (12 Months)
                </td>
                <td className="border border-surface-300 p-2">
                   Flat Rate for {roomCategory}
                </td>
                <td className="border border-surface-300 p-2 font-bold">
                  {formatCurrency(monthlyTotal)} / month
                </td>
              </tr>
              <tr className="bg-surface-50 font-bold text-[13px]">
                <td className="border border-surface-300 p-2 text-right" colSpan={2}>
                  Total for 12 Months
                </td>
                <td className="border border-surface-300 p-2">
                  {formatCurrency(twelveMonthsTotal)}/-
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Closing Paragraphs */}
        <div className="mb-8 space-y-3 text-xs leading-relaxed text-surface-600">
          <p>
            This special pricing has been extended considering your esteemed presence in the hospitality industry and our intent to build a strong, long-term partnership.
          </p>
          <p>
            We are confident that Bookito's technology-driven solutions will help streamline your operations, improve efficiency, and enhance overall revenue performance. Our team will ensure dedicated support and seamless onboarding throughout the implementation process.
          </p>
          <p>
            We look forward to a successful collaboration with <span className="font-bold text-surface-900">{propertyName}</span>.
          </p>
        </div>

        {/* Signature */}
        <div className="mb-12 text-xs">
          <p className="mb-1 text-surface-600">Warm regards,</p>
          <p className="font-bold">{executiveName}</p>
          <p>{executiveRole}</p>
          <p>Bookito Pvt. Ltd</p>
          <p>{executivePhone}</p>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t-[8px] border-emerald-600 pt-4">
          <div className="flex items-center justify-between text-[9px] font-medium text-surface-500 uppercase tracking-wider">
            <div className="flex items-start gap-2 max-w-[50%]">
              <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
              <span>2nd Floor, Shimla Tower, Police Station Rd, Sultan Bathery, Kerala 673592</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-emerald-600" />
                <span className="lowercase">info@bookito.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 text-emerald-600" />
                <span className="lowercase">www.bookito.in</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

QuotationDocument.displayName = 'QuotationDocument'
