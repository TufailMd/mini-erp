import { useState, useEffect } from 'react'
import ErpSidebar from '../components/sales/ErpSidebar'
import MOFormHeader from '../components/manufacturing/MOFormHeader'
import MOProductInfo from '../components/manufacturing/MOProductInfo'
import MOAvailabilityBar from '../components/manufacturing/MOAvailabilityBar'
import MOComponentsTable from '../components/manufacturing/MOComponentsTable'
import MOWorkOrdersTable from '../components/manufacturing/MOWorkOrdersTable'
import MOProgressPanel from '../components/manufacturing/MOProgressPanel'
import MONotes from '../components/manufacturing/MONotes'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { erpNavItems, erpFooterNavItems } from '../data/salesData'
import { toast } from 'react-hot-toast'
import { useErp } from '../context/ErpContext'
import {
  moFormData,
  productOptions,
  bomOptions,
  responsibleOptions,
} from '../data/moFormData'
import type { PageProps, MOStatus, MOComponent, MOWorkOrderEntry } from '../types'

type MOTab = 'overview' | 'components' | 'workorders'

export default function MOFormPage({ onNavigate }: PageProps) {
  const { manufacturingOrders, activeOrderId, confirmManufacturingOrder, completeManufacturingOrder } = useErp()
  
  const activeOrder = manufacturingOrders.find(mo => mo.id === activeOrderId) || manufacturingOrders[0]

  const [loading, setLoading] = useState(true)

  // Form fields
  const [finishedProduct, setFinishedProduct] = useState(activeOrder ? `Product ${activeOrder.productId}` : moFormData.finishedProduct)
  const [billOfMaterials, setBillOfMaterials] = useState(activeOrder ? `BOM ${activeOrder.bomId}` : moFormData.billOfMaterials)
  const [quantityToProduce, setQuantityToProduce] = useState(activeOrder?.quantityToProduce || 1)
  const [responsible, setResponsible] = useState(moFormData.responsible)
  const [scheduledDate, setScheduledDate] = useState(activeOrder?.createdAt || moFormData.scheduledDate)
  const [deadline, setDeadline] = useState(moFormData.deadline)
  const [sourceDocument, setSourceDocument] = useState(moFormData.sourceDocument)

  // Status & tab
  const [status, setStatus] = useState<MOStatus>((activeOrder?.status as any) || 'Draft')
  const [activeTab, setActiveTab] = useState<MOTab>('overview')

  // Arrays
  const [components, setComponents] = useState<MOComponent[]>(moFormData.components)
  const [workOrders, setWorkOrders] = useState<MOWorkOrderEntry[]>(moFormData.workOrders)

  // Notes
  const [notes, setNotes] = useState(moFormData.notes)

  // Derived
  const availability = moFormData.availability

  useEffect(() => {
    if (activeOrder) {
      setStatus(activeOrder.status as any)
      setFinishedProduct(`Product ${activeOrder.productId}`)
      setBillOfMaterials(`BOM ${activeOrder.bomId}`)
      setQuantityToProduce(activeOrder.quantityToProduce)
    }
  }, [activeOrder])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleButtonClick = () => {
    toast('New record created')
  }

  // Header handlers
  const handleBack = () => {
    onNavigate('manufacturing')
  }

  const handleConfirm = () => {
    if (activeOrder) confirmManufacturingOrder(activeOrder.id)
  }

  const handleCheckAvailability = () => {
    toast('Checking availability...')
  }

  const handleProduce = () => {
    setStatus('In Progress')
    toast.success('Status changed to In Progress')
  }

  const handleMarkDone = () => {
    if (activeOrder) completeManufacturingOrder(activeOrder.id)
  }

  const handleCancel = () => {
    setStatus('Cancelled')
    toast.error('Status changed to Cancelled')
  }

  // Component handlers
  const handleAddComponent = () => {
    const newComponent: MOComponent = {
      id: String(Date.now()),
      product: 'New Component',
      description: 'Component description',
      quantity: 0,
      uom: 'Units',
      status: 'Not Available',
    }
    setComponents([...components, newComponent])
    toast.success('Component added')
  }

  const handleDeleteComponent = (id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id))
    console.log('Component deleted:', id)
  }

  // Work order handlers
  const handleAddWorkOrder = () => {
    const newWorkOrder: MOWorkOrderEntry = {
      id: String(Date.now()),
      workCenter: 'New Work Center',
      operation: 'New Operation',
      expectedDuration: '0h 00m',
      realDuration: '0h 0m',
      status: 'Pending',
    }
    setWorkOrders([...workOrders, newWorkOrder])
    console.log('Work order added')
  }

  const handleDeleteWorkOrder = (id: string) => {
    setWorkOrders((prev) => prev.filter((wo) => wo.id !== id))
    console.log('Work order deleted:', id)
  }

  const tabs: { id: MOTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'components', label: 'Components' },
    { id: 'workorders', label: 'Work Orders' },
  ]

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ErpSidebar
        navItems={erpNavItems}
        footerItems={erpFooterNavItems}
        activePage="manufacturing"
        onNavigate={onNavigate}
        onNewRecordClick={handleButtonClick}
      />

      <div className="ml-60 flex min-h-screen flex-col">
        <MOFormHeader
          reference={activeOrder ? activeOrder.reference : moFormData.reference}
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
            <div className="flex gap-6">
              {/* Main content area */}
              <div className="min-w-0 flex-1 space-y-5">
                <MOProductInfo
                  finishedProduct={finishedProduct}
                  billOfMaterials={billOfMaterials}
                  quantityToProduce={quantityToProduce}
                  uom={moFormData.uom}
                  responsible={responsible}
                  scheduledDate={scheduledDate}
                  deadline={deadline}
                  sourceDocument={sourceDocument}
                  productOptions={productOptions}
                  bomOptions={bomOptions}
                  responsibleOptions={responsibleOptions}
                  onProductChange={setFinishedProduct}
                  onBomChange={setBillOfMaterials}
                  onQuantityChange={setQuantityToProduce}
                  onResponsibleChange={setResponsible}
                  onScheduledDateChange={setScheduledDate}
                  onDeadlineChange={setDeadline}
                  onSourceDocumentChange={setSourceDocument}
                />

                <MOAvailabilityBar
                  availability={availability}
                  components={components}
                />

                {/* Tabs */}
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

                {/* Tab content */}
                <div className="space-y-5">
                  {(activeTab === 'overview' || activeTab === 'components') && (
                    <MOComponentsTable
                      components={components}
                      onAddComponent={handleAddComponent}
                      onDeleteComponent={handleDeleteComponent}
                    />
                  )}

                  {(activeTab === 'overview' || activeTab === 'workorders') && (
                    <MOWorkOrdersTable
                      workOrders={workOrders}
                      onAddWorkOrder={handleAddWorkOrder}
                      onDeleteWorkOrder={handleDeleteWorkOrder}
                    />
                  )}
                </div>

                <MONotes notes={notes} onNotesChange={setNotes} />
              </div>

              {/* Right sidebar panel */}
              <div className="w-72 shrink-0">
                <MOProgressPanel
                  status={status}
                  producedQty={moFormData.producedQty}
                  quantityToProduce={quantityToProduce}
                  uom={moFormData.uom}
                  consumedQty={moFormData.consumedQty}
                  components={components}
                  workOrders={workOrders}
                  availability={availability}
                />
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  )
}
