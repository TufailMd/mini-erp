import type { PropsWithChildren } from 'react';

type FormFieldProps = PropsWithChildren<{
  label?: string;
  hint?: string;
  htmlFor?: string;
}>;

export default function FormField({ label, hint, htmlFor, children }: FormFieldProps) {
  return (
    <div className="space-y-1">
      {label ? <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">{label}</label> : null}
      <div>{children}</div>
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
