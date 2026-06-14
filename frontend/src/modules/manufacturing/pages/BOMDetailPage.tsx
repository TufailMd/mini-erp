import { useState, useEffect } from 'react'
import ErpSidebar from '@/components/layout/ErpSidebar'
import BOMDetailHeader from '@/modules/manufacturing/components/bom/BOMDetailHeader'
import BOMProductForm from '@/modules/manufacturing/components/bom/BOMProductForm'
import BOMComponentsList from '@/modules/manufacturing/components/bom/BOMComponentsList'
import BOMOperationsList from '@/modules/manufacturing/components/bom/BOMOperationsList'
import BOMAuditPanel from '@/modules/manufacturing/components/bom/BOMAuditPanel'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { erpNavItems, erpFooterNavItems } from '@/constants/navigation'
import { useErp } from '@/context/ErpContext'
import type { PageProps, BOMStatus, BOMComponent, BOMOperation } from '@/types'
import { toast } from 'react-hot-toast'

export default function BOMDetailPage({ onNavigate }: PageProps) {
  const { boms, activeOrderId, products, isLoading: loading } = useErp()
  const activeBom = boms.find(b => b.id === activeOrderId) || boms[0]
  
  const finishedProductOptions = products.map(p => p.name)
  const uomOptions = ['Unit', 'kg', 'pcs', 'liter', 'box']

  const [status, setStatus] = useState<BOMStatus>('Active')
  
  // Form State
  const [finishedProduct, setFinishedProduct] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [uom, setUom] = useState('Unit')
  const [notes, setNotes] = useState('')
  
  // Lists State
  const [components, setComponents] = useState<BOMComponent[]>([])
  const [operations, setOperations] = useState<BOMOperation[]>([])

  useEffect(() => {
    if (activeBom) {
      const parentProduct = products.find(p => p.id === activeBom.productId)
      setFinishedProduct(parentProduct?.name || `Product ${activeBom.productId}`)
      
      const mappedComps = activeBom.components?.map((c: any, idx: number) => {
        const product = products.find(p => p.id === c.productId)
        return {
          id: String(idx + 1),
          product: product?.name || `Product ${c.productId}`,
          description: product?.code || `SKU-${c.productId}`,
          quantity: c.quantity || 1,
          uom: 'Unit',
          cost: product?.costPrice || 0
        }
      }) || []
      setComponents(mappedComps)

      const rawOps = (activeBom as any).rawOperations || []
      const mappedOps = rawOps.map((op: any, idx: number) => ({
        id: String(idx + 1),
        workCenter: op.work_center,
        operation: op.operation_name,
        duration: `${op.expected_duration}m`,
        description: 'Standard routing operation'
      }))
      setOperations(mappedOps)
    }
  }, [activeBom, products])

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
    toast.error('Components cannot be added directly to an active BOM.')
  }

  const handleDeleteComponent = (id: string) => {
    toast.error('Components cannot be deleted from an active BOM.')
  }

  const handleAddOperation = () => {
    toast.error('Operations cannot be added directly to an active BOM.')
  }

  const handleDeleteOperation = (id: string) => {
    toast.error('Operations cannot be deleted from an active BOM.')
  }

  // Create an aggregated data object for the audit panel
  const aggregatedData = {
    status,
    finishedProduct,
    quantity,
    uom,
    notes: '',
    components,
    operations,
    reference: activeBom?.reference || 'New BOM',
    createdBy: 'System',
    createdDate: (activeBom as any)?.createdAt ? new Date((activeBom as any).createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
    lastModified: 'Today',
    auditLogs: [],
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
          reference={activeBom?.reference || 'New BOM'}
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
