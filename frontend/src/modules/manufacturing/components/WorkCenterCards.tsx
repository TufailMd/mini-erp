import type { WorkCenter } from '@/types'
import WorkCenterCard from '@/modules/manufacturing/components/WorkCenterCard'

interface WorkCenterCardsProps {
  centers: WorkCenter[]
}

export default function WorkCenterCards({ centers }: WorkCenterCardsProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      {centers.map((center) => (
        <WorkCenterCard key={center.id} center={center} />
      ))}
    </div>
  )
}
