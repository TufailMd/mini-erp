type LowStockItem = {
  name: string;
  sku?: string;
  stock: number;
  reorderLevel?: number;
};

type LowStockWidgetProps = {
  items: LowStockItem[];
  title?: string;
};

export default function LowStockWidget({ items, title = 'Low Stock Items' }: LowStockWidgetProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <article key={`${item.name}-${item.stock}`} className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
              <div>
                <p className="font-medium text-slate-900">{item.name}</p>
                {item.sku ? <p className="text-sm text-slate-500">SKU: {item.sku}</p> : null}
              </div>
              <div className="text-right">
                <p className="font-semibold text-rose-600">{item.stock} left</p>
                {typeof item.reorderLevel === 'number' ? (
                  <p className="text-xs text-slate-500">Reorder at {item.reorderLevel}</p>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm text-slate-500">No low stock alerts.</p>
        )}
      </div>
    </section>
  );
}