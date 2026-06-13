interface CustomerAvatarProps {
  initials: string
  color: string
  name: string
}

export default function CustomerAvatar({
  initials,
  color,
  name,
}: CustomerAvatarProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ${color}`}
      >
        {initials}
      </div>
      <span className="text-sm text-slate-700">{name}</span>
    </div>
  )
}
