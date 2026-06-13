import type { ReactNode } from 'react';
import KpiCard from "./KpiCard";

type KpiGridProps = {
  children?: ReactNode;
  className?: string;
};

export default function KpiGrid({ children, className = '' }: KpiGridProps) {
  if (children) {
    return <div className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-4 ${className}`.trim()}>{children}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiCard title="Products" value="125" />
      <KpiCard title="Inventory Value" value="₹4,50,000" />
      <KpiCard title="Sales Orders" value="42" />
      <KpiCard title="Manufacturing Orders" value="9" />
    </div>
  );
}