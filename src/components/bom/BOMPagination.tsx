import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BOMPaginationProps {
  total: number
  pageSize: number
}

export default function BOMPagination({ total, pageSize }: BOMPaginationProps) {
  const showing = Math.min(pageSize, total)

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Showing <span className="font-medium text-slate-900">1</span> to{' '}
        <span className="font-medium text-slate-900">{showing}</span> of{' '}
        <span className="font-medium text-slate-900">{total}</span> BOMs
      </p>

      <div className="flex items-center space-x-1">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-sm font-medium text-indigo-600">
          1
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
          2
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
          3
        </button>
        <span className="flex h-8 w-8 items-center justify-center text-slate-400">...</span>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
          5
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
