type EmptyStateProps = {
  title?: string;
  description?: string;
};

export default function EmptyState({ title = 'No data', description }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
      <p className="text-lg font-medium text-slate-900">{title}</p>
      {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
    </div>
  );
}
