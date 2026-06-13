type StatusBadgeProps = {
  status: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  children: string;
};

export default function StatusBadge({ status, children }: StatusBadgeProps) {
  const map: Record<StatusBadgeProps['status'], string> = {
    neutral: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-rose-100 text-rose-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[status]}`}>{children}</span>;
}
