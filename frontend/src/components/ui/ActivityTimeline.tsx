type Activity = {
  id: string;
  title: string;
  description?: string;
  time?: string;
};

type ActivityTimelineProps = {
  items: Activity[];
};

export default function ActivityTimeline({ items }: ActivityTimelineProps) {
  return (
    <div className="space-y-4">
      {items.map((it) => (
        <div key={it.id} className="flex gap-3">
          <div className="h-3 w-3 rounded-full bg-slate-300 mt-1" />
          <div>
            <p className="font-medium text-slate-900">{it.title}</p>
            {it.description ? <p className="text-sm text-slate-500">{it.description}</p> : null}
            {it.time ? <p className="text-xs text-slate-400 mt-1">{it.time}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
