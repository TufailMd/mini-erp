import { useState } from 'react'
import { defaultPageId, resolvePage } from './config/pageRegistry'
import type { PageId } from './types'

export default function StitchConversion() {
  const [activePage, setActivePage] = useState<PageId>(defaultPageId)

  const PageComponent = resolvePage(activePage)

  return <PageComponent activePage={activePage} onNavigate={setActivePage} />
}
