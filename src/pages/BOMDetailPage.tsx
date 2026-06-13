import { useState, useEffect } from 'react'
import ErpSidebar from '../components/sales/ErpSidebar'
import BOMDetailHeader from '../components/bom/BOMDetailHeader'
import BOMProductForm from '../components/bom/BOMProductForm'
import BOMComponentsList from '../components/bom/BOMComponentsList'
import BOMOperationsList from '../components/bom/BOMOperationsList'
import BOMAuditPanel from '../components/bom/BOMAuditPanel'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { erpNavItems, erpFooterNavItems } from '../data/salesData'
import { bomDetailData, finishedProductOptions, uomOptions } from '../data/bomDetailData'
import type { PageProps, BOMStatus, BOMComponent, BOMOperation } from '../types'
import { toast } from 'react-hot-toast'

export default function BOMDetailPage({ onNavigate }: PageProps) {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<BOMStatus>(bomDetailData.status)
  
  // Form State
  const [finishedProduct, setFinishedProduct] = useState(bomDetailData.finishedProduct)
  const [quantity, setQuantity] = useState(bomDetailData.quantity)
  const [uom, setUom] = useState(bomDetailData.uom)
  const [notes, setNotes] = useState(bomDetailData.notes)
  
  // Lists State
  const [components, setComponents] = useState<BOMComponent[]>(bomDetailData.components)
  const [operations, setOperations] = useState<BOMOperation[]>(bomDetailData.operations)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSave = () => {
    toast.success('BOM Saved successfully!')
    setStatus('Active')
  }

  const handleFieldChange = (field: string, value: string | number) => {
    switch (field) {
      case 'finishedProduct': setFinishedProduct(value as string); break
      case 'quantity': setQuantity(value as number); break
      case 'uom': setUom(value as string); break
      case 'notes': setNotes(value as string); break
    }
  }

  const handleAddComponent = () => {
    const newId = (components.length + 1).toString()
    setComponents([...components, {
      id: newId,
      product: 'New Component',
      description: 'Select component details',
      quantity: 1,
      uom: 'Unit',
      cost: 0
    }])
  }

  const handleDeleteComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id))
  }

  const handleAddOperation = () => {
    const newId = (operations.length + 1).toString()
    setOperations([...operations, {
      id: newId,
      workCenter: 'New Work Center',
      operation: 'New Operation',
      duration: '0h 00m',
      description: ''
    }])
  }

  const handleDeleteOperation = (id: string) => {
    setOperations(operations.filter(o => o.id !== id))
  }

  // Create an aggregated data object for the audit panel
  const aggregatedData = {
    ...bomDetailData,
    status,
    finishedProduct,
    quantity,
    uom,
    components,
    operations,
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ErpSidebar
        navItems={erpNavItems}
        footerItems={erpFooterNavItems}
        activePage="bom"
        onNavigate={onNavigate}
        onNewRecordClick={() => {}}
      />

      <div className="ml-60 flex min-h-screen flex-col">
        <BOMDetailHeader
          reference={bomDetailData.reference}
          status={status}
          onBack={() => onNavigate('bom')}
          onCancel={() => { toast('Edit Cancelled'); onNavigate('bom') }}
          onSave={handleSave}
          onViewAudit={() => onNavigate('audit-logs')}
        />

        <main className="flex-1 p-6">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="flex gap-6">
              <div className="flex-1 min-w-0">
                <BOMProductForm
                  finishedProduct={finishedProduct}
                  quantity={quantity}
                  uom={uom}
                  notes={notes}
                  finishedProductOptions={finishedProductOptions}
                  uomOptions={uomOptions}
                  onChange={handleFieldChange}
                />
                
                <BOMComponentsList
                  components={components}
                  onAddComponent={handleAddComponent}
                  onDeleteComponent={handleDeleteComponent}
                />

                <BOMOperationsList
                  operations={operations}
                  onAddOperation={handleAddOperation}
                  onDeleteOperation={handleDeleteOperation}
                />
              </div>

              <BOMAuditPanel data={aggregatedData} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
