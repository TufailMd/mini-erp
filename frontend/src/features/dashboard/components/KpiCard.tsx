type KpiCardProps = {
  title: string;
  value: string | number;
  change?: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
};

export default function KpiCard({
  title,
  value,
  change,
  description,
  trend = 'neutral',
}: KpiCardProps) {
  const trendClassName =
    trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-slate-500';

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <h3 className="text-3xl font-semibold text-slate-900">{value}</h3>
        {change ? <span className={`text-sm font-medium ${trendClassName}`}>{change}</span> : null}
      </div>
      {description ? <p className="mt-3 text-sm text-slate-600">{description}</p> : null}
    </article>
  );
}