type ErrorStateProps = {
  title?: string;
  message?: string;
};

export default function ErrorState({ title = 'Error', message }: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
      <p className="text-lg font-semibold text-rose-700">{title}</p>
      {message ? <p className="mt-2 text-sm text-rose-700">{message}</p> : null}
    </div>
  );
}
