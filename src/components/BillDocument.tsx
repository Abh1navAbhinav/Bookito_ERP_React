import React from 'react'
import { MapPin, Mail, Globe, CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface BillDocumentProps {
  propertyName: string
  closingAmount: number
  collectedAmount: number
  pendingAmount: number
  date: string
  executive: string
  invoiceNo: string
}

export const BillDocument = React.forwardRef<HTMLDivElement, BillDocumentProps>(
  ({ propertyName, closingAmount, collectedAmount, pendingAmount, date, executive, invoiceNo }, ref) => {
    return (
      <div 
        ref={ref} 
        className="mx-auto w-[210mm] min-h-[297mm] bg-white p-[15mm] text-surface-900 shadow-xl print:m-0 print:p-[12mm] print:shadow-none print:min-h-screen flex flex-col"
        style={{ fontFamily: "'Inter', sans-serif", pageBreakAfter: 'always' }}
      >
        {/* Header/Logo */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary-600">
               Bookito
            </h1>
            <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-surface-500 uppercase">
              Official Receipt
            </p>
          </div>
          <div className="text-right">
             <div className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-1 text-right">Invoice No</div>
             <div className="text-sm font-bold text-surface-900">{invoiceNo}</div>
             <div className="text-xs text-surface-500 mt-1">{date}</div>
          </div>
        </div>

        <div className="flex justify-between items-start mb-10 border-b border-surface-100 pb-10">
           <div className="space-y-1">
              <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest">Billed To</h3>
              <p className="text-sm font-bold text-surface-900 uppercase">{propertyName}</p>
              <p className="text-xs text-surface-500">Property Partner</p>
           </div>
           <div className="text-right space-y-1">
              <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest">Issued By</h3>
              <p className="text-sm font-bold text-surface-900">Bookito Pvt Ltd</p>
              <p className="text-xs text-surface-500">Kerala, India</p>
           </div>
        </div>

        {/* Amount Summary */}
        <div className="grid grid-cols-3 gap-6 mb-12">
           <div className="bg-surface-50 p-4 rounded-xl border border-surface-100 group transition-all hover:bg-white hover:shadow-md">
              <p className="text-[10px] font-bold text-surface-400 uppercase mb-1">Total Agreement</p>
              <p className="text-lg font-bold text-surface-900">{formatCurrency(closingAmount)}</p>
           </div>
           <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 relative overflow-hidden group transition-all hover:bg-emerald-100">
              <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Total Received</p>
              <p className="text-lg font-bold text-emerald-700">{formatCurrency(collectedAmount)}</p>
              <CheckCircle2 className="absolute right-[-10px] bottom-[-10px] h-12 w-12 text-emerald-200/50" />
           </div>
           <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex flex-col justify-center">
              <p className="text-[10px] font-bold text-rose-500 uppercase mb-1">Balance Due</p>
              <p className="text-lg font-bold text-rose-600">{formatCurrency(pendingAmount)}</p>
           </div>
        </div>

        {/* Transaction Detail */}
        <div className="mb-12">
            <h3 className="text-sm font-bold mb-4 border-l-4 border-primary-600 pl-3">Transaction Details</h3>
            <div className="bg-surface-50/50 rounded-xl border border-surface-100 p-6">
               <div className="grid grid-cols-2 gap-y-6 text-xs grayscale-[0.5]">
                  <div className="flex flex-col gap-1">
                     <span className="text-surface-400 font-medium font-bold uppercase tracking-wider text-[10px]">Payment Method</span>
                     <span className="text-surface-900 font-semibold font-bold">Bank Transfer / UPI</span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                     <span className="text-surface-400 font-medium font-bold uppercase tracking-wider text-[10px]">Transaction Status</span>
                     <span className="text-emerald-600 font-bold uppercase tracking-widest">{pendingAmount === 0 ? 'Fully Paid' : 'Partial Payment'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-surface-400 font-medium font-bold uppercase tracking-wider text-[10px]">Billing Executive</span>
                     <span className="text-surface-900 font-semibold font-bold">{executive}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                     <span className="text-surface-400 font-medium font-bold uppercase tracking-wider text-[10px]">Account Dept</span>
                     <span className="text-surface-900 font-semibold font-bold">Verified by Accountant</span>
                  </div>
               </div>
            </div>
        </div>

        {/* Notes */}
        <div className="mb-12">
           <h3 className="text-xs font-bold text-surface-400 uppercase mb-3">Important Notes</h3>
           <ul className="text-[10px] text-surface-500 space-y-1.5 leading-relaxed list-disc ml-4">
              <li>This is a computer-generated receipt and requires no physical signature.</li>
              <li>GST input tax credit is applicable as per the standard slab of 18%.</li>
              <li>Please mention your Invoice No. for any future communication regarding this payment.</li>
              <li>Thank you for choosing Bookito as your technology partner!</li>
           </ul>
        </div>

        {/* Decorative Seal Placeholder */}
        <div className="flex justify-end mb-10 opacity-30">
           <div className="h-24 w-24 rounded-full border-4 border-primary-100 flex items-center justify-center p-2">
              <div className="h-full w-full rounded-full border border-dashed border-primary-200 flex items-center justify-center text-[8px] font-bold text-primary-200 text-center uppercase leading-tight">
                 Official<br/>Digital<br/>Seal
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t-[8px] border-primary-600 pt-10">
          <div className="flex items-center justify-between text-[9px] font-medium text-surface-500 uppercase tracking-wider">
            <div className="flex items-start gap-2 max-w-[50%]">
              <MapPin className="h-3 w-3 text-primary-600 shrink-0" />
              <span>2nd Floor, Shimla Tower, Sultan Bathery, Kerala 673592</span>
            </div>
            <div className="flex flex-col gap-1.5 grayscale-[0.5]">
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-primary-600" />
                <span className="lowercase font-bold">accounts@bookito.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 text-primary-600" />
                <span className="lowercase font-bold">www.bookito.in</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

BillDocument.displayName = 'BillDocument'
