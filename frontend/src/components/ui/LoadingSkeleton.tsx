type LoadingSkeletonProps = {
  className?: string;
};

export default function LoadingSkeleton({ className = '' }: LoadingSkeletonProps) {
  return <div className={`animate-pulse bg-slate-100 ${className}`} />;
}
