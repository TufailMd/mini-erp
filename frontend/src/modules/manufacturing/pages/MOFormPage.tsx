import { useState, useEffect } from 'react'
import ErpSidebar from '@/components/layout/ErpSidebar'
import MOFormHeader from '@/modules/manufacturing/components/MOFormHeader'
import MOProductInfo from '@/modules/manufacturing/components/MOProductInfo'
import MOAvailabilityBar from '@/modules/manufacturing/components/MOAvailabilityBar'
import MOComponentsTable from '@/modules/manufacturing/components/MOComponentsTable'
import MOWorkOrdersTable from '@/modules/manufacturing/components/MOWorkOrdersTable'
import MOProgressPanel from '@/modules/manufacturing/components/MOProgressPanel'
import MONotes from '@/modules/manufacturing/components/MONotes'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { erpNavItems, erpFooterNavItems } from '@/constants/navigation'
import { LayoutGrid, Plus, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'
import { toast } from 'react-hot-toast'
import { useErp } from '@/context/ErpContext'
import { manufacturingApi } from '@/api/manufacturingApi'
import type { PageProps, MOStatus, MOComponent, MOWorkOrderEntry, CreateLineItem } from '@/types'
import type { ErpProduct } from '@/types/erp'

type MOTab = 'overview' | 'components' | 'workorders'

export default function MOFormPage({ onNavigate }: PageProps) {
  const {
    manufacturingOrders,
    activeOrderId,
    products,
    boms,
    confirmManufacturingOrder,
    startManufacturingOrder,
    completeManufacturingOrder,
    cancelManufacturingOrder,
    createManufacturingOrder,
    refreshData,
  } = useErp()

  const isNew = !activeOrderId
  const activeOrder = activeOrderId
    ? manufacturingOrders.find(mo => mo.id === activeOrderId)
    : undefined

  // ─── Form field IDs (for new MO) ──────────────────────────────────────────
  const [selectedProductId, setSelectedProductId] = useState('')
  const [selectedBomId, setSelectedBomId] = useState('')
  const [quantityToProduce, setQuantityToProduce] = useState(1)
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0])
  const [deadline, setDeadline] = useState('')
  const [sourceDocument, setSourceDocument] = useState('')

  // ─── Display fields (for viewing existing MO) ─────────────────────────────
  const [finishedProductName, setFinishedProductName] = useState('')
  const [bomName, setBomName] = useState('')

  // ─── Status, tab, arrays ───────────────────────────────────────────────────
  const [status, setStatus] = useState<MOStatus>('Draft')
  const [activeTab, setActiveTab] = useState<MOTab>('overview')
  const [components, setComponents] = useState<MOComponent[]>([])
  const [workOrders, setWorkOrders] = useState<MOWorkOrderEntry[]>([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // ─── Sync state from active order ─────────────────────────────────────────
  useEffect(() => {
    if (activeOrder) {
      const currentStatus: MOStatus =
        activeOrder.status === 'Completed' ? 'Done' :
        activeOrder.status === 'Partially Processed' ? 'In Progress' :
        (activeOrder.status as MOStatus) || 'Draft'

      setStatus(currentStatus)
      setQuantityToProduce(activeOrder.quantityToProduce)
      setScheduledDate(activeOrder.createdAt ? new Date(activeOrder.createdAt).toISOString().split('T')[0] : '')

      const product = products.find(p => p.id === activeOrder.productId)
      setFinishedProductName(product?.name || `Product ${activeOrder.productId}`)
      setSelectedProductId(activeOrder.productId || '')

      const bomObj = boms.find(b => b.id === activeOrder.bomId)
      setBomName(bomObj?.reference || (activeOrder.bomId ? `BOM-${activeOrder.bomId.slice(-4).toUpperCase()}` : 'Manual'))
      setSelectedBomId(activeOrder.bomId || '')

      // Map raw components
      const rawComps = (activeOrder as any).rawComponents || []
      const mappedComps: MOComponent[] = rawComps.map((c: any, idx: number) => ({
        id: c._id || String(idx),
        product: c.product_name,
        description: 'Component material',
        quantity: c.to_consume_qty,
        uom: c.units || 'Units',
        status: (
          c.availability >= c.to_consume_qty ? 'Available' :
          c.availability > 0 ? 'Partially Available' : 'Not Available'
        ) as any,
      }))
      setComponents(mappedComps)

      // Map raw operations
      const rawOps = (activeOrder as any).rawOperations || []
      const mappedOps: MOWorkOrderEntry[] = rawOps.map((op: any, idx: number) => ({
        id: op._id || String(idx),
        workCenter: op.work_center,
        operation: op.operation_name,
        expectedDuration: `${op.expected_duration}m`,
        realDuration: op.real_duration > 0 ? `${op.real_duration}m` : '0m',
        status: (
          currentStatus === 'Done' ? 'Finished' :
          currentStatus === 'In Progress' ? 'In Progress' : 'Pending'
        ) as any,
      }))
      setWorkOrders(mappedOps)
    } else {
      // Reset for new MO
      setStatus('Draft')
      setComponents([])
      setWorkOrders([])
      setSelectedProductId(products[0]?.id || '')
      setFinishedProductName(products[0]?.name || '')
      setSelectedBomId('')
      setBomName('')
    }
  }, [activeOrder, products, boms])

  // Auto-populate BOM when product changes (new MO mode)
  useEffect(() => {
    if (isNew && selectedProductId) {
      const product = products.find(p => p.id === selectedProductId)
      setFinishedProductName(product?.name || '')
      const matchingBom = boms.find(b => b.productId === selectedProductId)
      if (matchingBom) {
        setSelectedBomId(matchingBom.id)
        setBomName(matchingBom.reference)
      } else {
        setSelectedBomId('')
        setBomName('')
      }
    }
  }, [selectedProductId, isNew])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  // ─── Computed availability ─────────────────────────────────────────────────
  const availability: 'available' | 'partial' | 'unavailable' =
    components.length === 0 ? 'available' :
    components.every(c => c.status === 'Available') ? 'available' :
    components.some(c => c.status === 'Available' || c.status === 'Partially Available') ? 'partial' :
    'unavailable'

  // ─── Add / delete components on Draft MOs ─────────────────────────────────
  const handleAddComponentSave = async ({ productId, qty, units }: { productId: string; qty: number; units: string }) => {
    if (!activeOrder) return
    const product = products.find(p => p.id === productId)
    if (!product) return

    const updatedComponents = [
      ...((activeOrder as any).rawComponents || []).map((c: any) => ({
        product_id: c.product_id,
        to_consume_qty: c.to_consume_qty,
        units: c.units,
      })),
      { product_id: productId, to_consume_qty: qty, units },
    ]

    try {
      await manufacturingApi.updateOrder(activeOrder.id, { components: updatedComponents })
      toast.success(`${product.name} added as component`)
      await refreshData()
    } catch (err: any) {
      toast.error(err.message || 'Failed to add component')
    }
  }

  const handleDeleteComponent = async (compId: string) => {
    if (!activeOrder) return
    const rawComps = (activeOrder as any).rawComponents || []
    const updatedComponents = rawComps
      .filter((c: any) => (c._id || '') !== compId)
      .map((c: any) => ({
        product_id: c.product_id,
        to_consume_qty: c.to_consume_qty,
        units: c.units,
      }))

    try {
      await manufacturingApi.updateOrder(activeOrder.id, { components: updatedComponents })
      toast.success('Component removed')
      await refreshData()
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove component')
    }
  }

  const handleBack = () => onNavigate('manufacturing')

  const handleCreate = async () => {
    if (!selectedProductId) { toast.error('Please select a finished product'); return }
    if (quantityToProduce <= 0) { toast.error('Quantity must be greater than 0'); return }

    setSaving(true)
    try {
      await createManufacturingOrder({
        finished_product_id: selectedProductId,
        quantity: quantityToProduce,
        bom_id: selectedBomId || undefined,
        schedule_date: scheduledDate,
      })
      // createManufacturingOrder sets activeOrderId, so just navigate back
      onNavigate('manufacturing')
    } catch {
      // Error already toasted
    } finally {
      setSaving(false)
    }
  }

  const handleConfirm = async () => {
    if (!activeOrder) return
    await confirmManufacturingOrder(activeOrder.id)
    await refreshData()
  }

  const handleProduce = async () => {
    if (!activeOrder) return
    await startManufacturingOrder(activeOrder.id)
    await refreshData()
  }

  const handleMarkDone = async () => {
    if (!activeOrder) return
    await completeManufacturingOrder(activeOrder.id)
    await refreshData()
  }

  const handleCancel = async () => {
    if (!activeOrder) return
    await cancelManufacturingOrder(activeOrder.id)
    onNavigate('manufacturing')
  }

  const handleCheckAvailability = async () => {
    if (!activeOrder) return
    // Re-fetch the detail from backend to get fresh availability
    try {
      const res = await fetch(`/api/manufacturing/${activeOrder.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      const json = await res.json()
      if (json.success) {
        const rawComps = json.data.components || []
        const mapped: MOComponent[] = rawComps.map((c: any, idx: number) => ({
          id: c._id || String(idx),
          product: c.product_name,
          description: 'Component material',
          quantity: c.to_consume_qty,
          uom: c.units || 'Units',
          status: (
            c.availability >= c.to_consume_qty ? 'Available' :
            c.availability > 0 ? 'Partially Available' : 'Not Available'
          ) as any,
        }))
        setComponents(mapped)
        toast.success('Availability refreshed from stock')
      }
    } catch {
      toast.error('Failed to check availability')
    }
  }

  // ─── Dropdowns ─────────────────────────────────────────────────────────────
  const productOptions = products.map(p => p.name)
  const bomOptions = ['(None)', ...boms.map(b => b.reference)]
  const responsibleOptions = ['Mahesh Gupta', 'John Doe', 'Jane Smith']

  const tabs: { id: MOTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'components', label: `Components (${components.length})` },
    { id: 'workorders', label: `Work Orders (${workOrders.length})` },
  ]

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ErpSidebar
        navItems={erpNavItems}
        footerItems={erpFooterNavItems}
        activePage="manufacturing"
        onNavigate={onNavigate}
        onNewRecordClick={() => { onNavigate('mo-form') }}
      />

      <div className="ml-60 flex min-h-screen flex-col">
        <MOFormHeader
          reference={activeOrder ? activeOrder.reference : 'MO-NEW'}
          status={status}
          onBack={handleBack}
          onCheckAvailability={handleCheckAvailability}
          onProduce={handleProduce}
          onMarkDone={handleMarkDone}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />

        {loading ? (
          <LoadingSpinner className="mt-32" />
        ) : (
          <main className="flex-1 p-6">
            {/* ── NEW MO SAVE BUTTON ── */}
            {isNew && (
              <div className="mb-4 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-5 py-3">
                <span className="text-sm font-medium text-indigo-700">
                  You are creating a new Manufacturing Order
                </span>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : '✓ Save Manufacturing Order'}
                </button>
              </div>
            )}

            <div className="flex gap-6">
              {/* ── Main form ── */}
              <div className="min-w-0 flex-1 space-y-5">
                <MOProductInfo
                  finishedProduct={finishedProductName}
                  billOfMaterials={bomName}
                  quantityToProduce={quantityToProduce}
                  uom={'Units'}
                  responsible={responsibleOptions[0]}
                  scheduledDate={scheduledDate}
                  deadline={deadline}
                  sourceDocument={sourceDocument}
                  productOptions={productOptions}
                  bomOptions={bomOptions}
                  responsibleOptions={responsibleOptions}
                  onProductChange={(name) => {
                    if (isNew) {
                      const p = products.find(pr => pr.name === name)
                      if (p) setSelectedProductId(p.id)
                    }
                    setFinishedProductName(name)
                  }}
                  onBomChange={(ref) => {
                    if (isNew) {
                      if (ref === '(None)') { setSelectedBomId(''); setBomName('') ; return }
                      const b = boms.find(bm => bm.reference === ref)
                      if (b) setSelectedBomId(b.id)
                    }
                    setBomName(ref)
                  }}
                  onQuantityChange={setQuantityToProduce}
                  onResponsibleChange={() => {}}
                  onScheduledDateChange={setScheduledDate}
                  onDeadlineChange={setDeadline}
                  onSourceDocumentChange={setSourceDocument}
                />

                {/* Availability bar — only for existing orders with components */}
                {!isNew && components.length > 0 && (
                  <MOAvailabilityBar
                    availability={availability}
                    components={components}
                  />
                )}

                {/* Tabs — only for existing orders */}
                {!isNew && (
                  <>
                    <div className="flex items-center gap-1 border-b border-slate-200">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                            activeTab === tab.id
                              ? 'border-indigo-600 text-indigo-700'
                              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-5">
                      {(activeTab === 'overview' || activeTab === 'components') && (
                        <MOComponentsTable
                          components={components}
                          isDraft={status === 'Draft'}
                          onAddComponent={handleAddComponentSave}
                          onDeleteComponent={handleDeleteComponent}
                        />
                      )}
                      {(activeTab === 'overview' || activeTab === 'workorders') && (
                        <MOWorkOrdersTable
                          workOrders={workOrders}
                          onAddWorkOrder={() => toast.error('Edit work orders via BOM before confirming')}
                          onDeleteWorkOrder={() => toast.error('Cannot delete work orders on active order')}
                        />
                      )}
                    </div>
                  </>
                )}

                <MONotes notes={notes} onNotesChange={setNotes} />
              </div>

              {/* ── Right sidebar ── */}
              <div className="w-72 shrink-0">
                <MOProgressPanel
                  status={status}
                  producedQty={status === 'Done' ? quantityToProduce : 0}
                  quantityToProduce={quantityToProduce}
                  uom={'Units'}
                  consumedQty={status === 'Done' ? quantityToProduce : 0}
                  components={components}
                  workOrders={workOrders}
                  availability={availability}
                />

                {/* Stock impact info */}
                {!isNew && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500 space-y-2">
                    <p className="font-semibold text-slate-700 text-sm">Stock Flow</p>
                    <div className="space-y-1">
                      <p>• <span className="text-blue-600 font-medium">Confirm</span> → reserves component stock</p>
                      <p>• <span className="text-amber-600 font-medium">Produce</span> → starts production</p>
                      <p>• <span className="text-green-600 font-medium">Mark Done</span> → consumes components &amp; adds finished goods to inventory</p>
                    </div>
                    <p className="pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                      Changes reflect automatically in Inventory &amp; Stock Ledger
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  )
}
