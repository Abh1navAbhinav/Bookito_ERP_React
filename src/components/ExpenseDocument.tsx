import React from 'react'
import { MapPin, Mail, Globe, Receipt as ReceiptIcon } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ExpenseDocumentProps {
  description: string
  category: string
  amount: number
  date: string
  expenseId: string
}

export const ExpenseDocument = React.forwardRef<HTMLDivElement, ExpenseDocumentProps>(
  ({ description, category, amount, date, expenseId }, ref) => {
    return (
      <div 
        ref={ref} 
        className="mx-auto w-[210mm] min-h-[297mm] bg-white p-[15mm] text-surface-900 shadow-xl print:m-0 print:p-[12mm] print:shadow-none print:min-h-screen flex flex-col"
        style={{ fontFamily: "'Inter', sans-serif", pageBreakAfter: 'always' }}
      >
        {/* Header/Logo */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-rose-600">
               Bookito
            </h1>
            <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-surface-500 uppercase">
              Expense Voucher
            </p>
          </div>
          <div className="text-right">
             <div className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-1">Voucher No</div>
             <div className="text-sm font-bold text-surface-900">EXP-{expenseId.toUpperCase()}</div>
             <div className="text-xs text-surface-500 mt-1">{date}</div>
          </div>
        </div>

        <div className="flex justify-between items-start mb-10 border-b border-surface-100 pb-10">
           <div className="space-y-1">
              <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest">Expense Category</h3>
              <p className="text-sm font-bold text-surface-900 uppercase">{category}</p>
              <p className="text-xs text-surface-500">Business Expenditure</p>
           </div>
           <div className="text-right space-y-1">
              <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest">Verified By</h3>
              <p className="text-sm font-bold text-surface-900">Bookito Accounts</p>
              <p className="text-xs text-surface-500">Kerala, India</p>
           </div>
        </div>

        {/* Amount Summary */}
        <div className="grid grid-cols-2 gap-6 mb-12">
           <div className="bg-surface-50 p-6 rounded-2xl border border-surface-100">
              <p className="text-[10px] font-bold text-surface-400 uppercase mb-2 tracking-widest">Description</p>
              <p className="text-base font-semibold text-surface-900 leading-tight">{description}</p>
           </div>
           <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 relative overflow-hidden flex flex-col justify-center">
              <p className="text-[10px] font-bold text-rose-600 uppercase mb-2 tracking-widest">Total Amount</p>
              <p className="text-3xl font-extrabold text-rose-700">{formatCurrency(amount)}</p>
              <ReceiptIcon className="absolute right-[-10px] bottom-[-10px] h-16 w-16 text-rose-200/30" />
           </div>
        </div>

        {/* Detail Table */}
        <div className="mb-12">
           <table className="w-full text-left text-xs">
              <thead>
                 <tr className="border-b-2 border-surface-200">
                    <th className="py-3 font-bold uppercase tracking-wider text-surface-500">Particulars</th>
                    <th className="py-3 font-bold uppercase tracking-wider text-surface-500 text-right">Amount</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                 <tr>
                    <td className="py-4">
                       <p className="font-bold text-surface-900">{description}</p>
                       <p className="text-[10px] text-surface-400 mt-1">Classification: {category}</p>
                    </td>
                    <td className="py-4 text-right font-bold text-surface-900">
                       {formatCurrency(amount)}
                    </td>
                 </tr>
              </tbody>
              <tfoot>
                 <tr className="border-t-2 border-surface-200 font-bold bg-surface-50/50">
                    <td className="py-4 px-3">Sub Total</td>
                    <td className="py-4 px-3 text-right">{formatCurrency(amount)}</td>
                 </tr>
                 <tr className="border-t border-surface-200 font-extrabold text-sm">
                    <td className="py-4 px-3">Grand Total</td>
                    <td className="py-4 px-3 text-right text-rose-600">{formatCurrency(amount)}</td>
                 </tr>
              </tfoot>
           </table>
        </div>

        {/* Declaration */}
        <div className="mb-12 p-6 bg-surface-50/50 rounded-xl border border-dashed border-surface-200">
           <p className="text-[10px] text-surface-500 italic leading-relaxed">
              I hereby declare that the above mentioned expenses were incurred solely for the benefit of the business and are accurate to the best of my knowledge. All necessary proofs/bills have been attached with the original voucher.
           </p>
           <div className="mt-8 flex justify-between items-end">
              <div className="text-center">
                 <div className="h-0.5 w-32 bg-surface-300 mb-2"></div>
                 <p className="text-[9px] font-bold text-surface-400 uppercase tracking-wider">Employee Signature</p>
              </div>
              <div className="text-center">
                 <div className="h-0.5 w-32 bg-surface-300 mb-2"></div>
                 <p className="text-[9px] font-bold text-surface-400 uppercase tracking-wider">Approved By (Accountant)</p>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t-2 border-surface-100 pt-8">
          <div className="flex items-center justify-between text-[8px] font-bold text-surface-400 uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-rose-500" />
              <span>Shimla Tower, Sultan Bathery, Kerala</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-rose-500" />
                  <span className="lowercase tracking-normal">admin@bookito.in</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <Globe className="h-3 w-3 text-rose-500" />
                  <span className="lowercase tracking-normal">www.bookito.in</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

ExpenseDocument.displayName = 'ExpenseDocument'
