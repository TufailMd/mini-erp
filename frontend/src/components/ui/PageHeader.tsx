import type { PropsWithChildren } from 'react';

type PageHeaderProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export default function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </header>
  );
}
