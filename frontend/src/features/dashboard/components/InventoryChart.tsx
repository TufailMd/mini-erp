type InventoryChartProps = {
  title?: string;
  subtitle?: string;
};

export default function InventoryChart({
  title = 'Inventory Trend',
  subtitle = 'Stock movement and availability',
}: InventoryChartProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </header>
      <div className="mt-5 flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
        Inventory chart placeholder
      </div>
    </section>
  );
}