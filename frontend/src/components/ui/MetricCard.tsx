type MetricCardProps = {
  label: string;
  value: string | number;
  delta?: string;
};

export default function MetricCard({ label, value, delta }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-2xl font-semibold text-slate-900">{value}</span>
        {delta ? <span className="text-sm text-slate-500">{delta}</span> : null}
      </div>
    </div>
  );
}
