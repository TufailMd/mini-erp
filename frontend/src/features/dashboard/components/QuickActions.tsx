type QuickAction = {
  label: string;
  description?: string;
  onClick?: () => void;
};

type QuickActionsProps = {
  actions: QuickAction[];
  title?: string;
};

export default function QuickActions({ actions, title = 'Quick Actions' }: QuickActionsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className="rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50"
          >
            <p className="font-medium text-slate-900">{action.label}</p>
            {action.description ? <p className="mt-1 text-sm text-slate-500">{action.description}</p> : null}
          </button>
        ))}
      </div>
    </section>
  );
}