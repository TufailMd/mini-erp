interface OrderSummaryProps {
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export default function OrderSummary({
  subtotal,
  taxRate,
  taxAmount,
  total,
}: OrderSummaryProps) {
  return (
    <div className="mt-4 flex justify-end">
      <div className="w-64 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Subtotal</span>
          <span className="font-medium text-slate-700">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Tax ({taxRate}%)</span>
          <span className="font-medium text-slate-700">
            {formatCurrency(taxAmount)}
          </span>
        </div>
        <div className="border-t border-slate-200 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">Total</span>
            <span className="text-lg font-bold text-indigo-600">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
