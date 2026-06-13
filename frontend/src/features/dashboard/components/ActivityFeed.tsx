type ActivityItem = {
  title: string;
  detail: string;
  time: string;
};

type ActivityFeedProps = {
  items: ActivityItem[];
  title?: string;
};

export default function ActivityFeed({ items, title = 'Recent Activity' }: ActivityFeedProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-4 space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <article key={`${item.title}-${item.time}`} className="border-l-2 border-slate-200 pl-4">
              <p className="font-medium text-slate-900">{item.title}</p>
              <p className="text-sm text-slate-600">{item.detail}</p>
              <p className="mt-1 text-xs text-slate-500">{item.time}</p>
            </article>
          ))
        ) : (
          <p className="text-sm text-slate-500">No recent activity.</p>
        )}
      </div>
    </section>
  );
}