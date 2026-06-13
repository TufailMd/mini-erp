import { createContext, useContext, useState, ReactNode } from 'react'
import { toast } from 'react-hot-toast'
import type { 
  ErpProduct, BillOfMaterial, SalesOrder, PurchaseOrder, 
  ManufacturingOrder, StockLedgerEntry 
} from '../types/erp'
import { 
  initialProducts, initialBoms, initialSalesOrders, 
  initialPurchaseOrders, initialManufacturingOrders, initialStockLedger 
} from '../data/erpInitialData'

interface ErpContextType {
  products: ErpProduct[]
  boms: BillOfMaterial[]
  salesOrders: SalesOrder[]
  purchaseOrders: PurchaseOrder[]
  manufacturingOrders: ManufacturingOrder[]
  stockLedger: StockLedgerEntry[]
  
  // UI State for simple routing without URL params
  activeOrderId: string | null
  setActiveOrderId: (id: string | null) => void
  
  // Actions
  confirmSalesOrder: (orderId: string) => void
  deliverSalesOrder: (orderId: string) => void
  confirmPurchaseOrder: (orderId: string) => void
  receivePurchaseOrder: (orderId: string) => void
  confirmManufacturingOrder: (orderId: string) => void
  completeManufacturingOrder: (orderId: string) => void
}

const ErpContext = createContext<ErpContextType | undefined>(undefined)

export function ErpProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ErpProduct[]>(initialProducts)
  const [boms] = useState<BillOfMaterial[]>(initialBoms)
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(initialSalesOrders)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders)
  const [manufacturingOrders, setManufacturingOrders] = useState<ManufacturingOrder[]>(initialManufacturingOrders)
  const [stockLedger, setStockLedger] = useState<StockLedgerEntry[]>(initialStockLedger)

  const [activeOrderId, setActiveOrderId] = useState<string | null>(null)

  const generateId = (prefix: string) => `${prefix}-${Math.floor(Math.random() * 10000)}`

  // --- CORE BUSINESS LOGIC ---

  const confirmSalesOrder = (orderId: string) => {
    setSalesOrders(prev => prev.map(so => so.id === orderId ? { ...so, status: 'Confirmed' } : so))
    
    const so = salesOrders.find(s => s.id === orderId)
    if (!so) return

    let updatedProducts = [...products]
    let newPOs: PurchaseOrder[] = []
    let newMOs: ManufacturingOrder[] = []

    so.items.forEach(item => {
      const productIndex = updatedProducts.findIndex(p => p.id === item.productId)
      if (productIndex === -1) return
      
      const product = updatedProducts[productIndex]
      // Reserve quantity
      updatedProducts[productIndex] = {
        ...product,
        reservedQty: product.reservedQty + item.quantity
      }

      // Check Shortage based on Free To Use (onHand - reserved)
      // Note: we use the newly updated product
      const p = updatedProducts[productIndex]
      const freeToUse = p.onHandQty - p.reservedQty
      
      // If shortage and it's Make To Order, trigger procurement
      if (freeToUse < 0 && p.procurementType === 'MTO') {
        const shortageQty = Math.abs(freeToUse)
        
        if (p.procurementMethod === 'Manufacturing') {
          newMOs.push({
            id: generateId('MO'),
            reference: `MO-AUTO-${Date.now()}`,
            productId: p.id,
            quantityToProduce: shortageQty,
            status: 'Draft',
            bomId: boms.find(b => b.productId === p.id)?.id,
            createdAt: new Date().toISOString()
          })
          toast.success(`Automated Manufacturing Order created for ${p.name}`)
        } else {
          newPOs.push({
            id: generateId('PO'),
            reference: `PO-AUTO-${Date.now()}`,
            vendorId: p.defaultVendorId || 'UNKNOWN',
            status: 'Draft',
            items: [{ id: generateId('POI'), productId: p.id, quantity: shortageQty, price: p.costPrice }],
            totalAmount: shortageQty * p.costPrice,
            createdAt: new Date().toISOString()
          })
          toast.success(`Automated Purchase Order created for ${p.name}`)
        }
      }
    })

    setProducts(updatedProducts)
    if (newMOs.length > 0) setManufacturingOrders(prev => [...prev, ...newMOs])
    if (newPOs.length > 0) setPurchaseOrders(prev => [...prev, ...newPOs])
  }

  const deliverSalesOrder = (orderId: string) => {
    setSalesOrders(prev => prev.map(so => so.id === orderId ? { ...so, status: 'Completed' } : so))
    
    const so = salesOrders.find(s => s.id === orderId)
    if (!so) return

    let updatedProducts = [...products]
    let newLedger: StockLedgerEntry[] = []

    so.items.forEach(item => {
      const productIndex = updatedProducts.findIndex(p => p.id === item.productId)
      if (productIndex === -1) return
      
      const p = updatedProducts[productIndex]
      updatedProducts[productIndex] = {
        ...p,
        onHandQty: p.onHandQty - item.quantity,
        reservedQty: Math.max(0, p.reservedQty - item.quantity)
      }

      newLedger.push({
        id: generateId('LED'),
        date: new Date().toISOString(),
        productId: p.id,
        movementType: 'Out',
        quantity: item.quantity,
        reference: so.reference
      })
    })

    setProducts(updatedProducts)
    setStockLedger(prev => [...prev, ...newLedger])
    toast.success(`Sales Order delivered. Stock deducted.`)
  }

  const confirmPurchaseOrder = (orderId: string) => {
    setPurchaseOrders(prev => prev.map(po => po.id === orderId ? { ...po, status: 'Confirmed' } : po))
  }

  const receivePurchaseOrder = (orderId: string) => {
    setPurchaseOrders(prev => prev.map(po => po.id === orderId ? { ...po, status: 'Completed' } : po))
    
    const po = purchaseOrders.find(p => p.id === orderId)
    if (!po) return

    let updatedProducts = [...products]
    let newLedger: StockLedgerEntry[] = []

    po.items.forEach(item => {
      const productIndex = updatedProducts.findIndex(p => p.id === item.productId)
      if (productIndex === -1) return
      
      const p = updatedProducts[productIndex]
      updatedProducts[productIndex] = {
        ...p,
        onHandQty: p.onHandQty + item.quantity
      }

      newLedger.push({
        id: generateId('LED'),
        date: new Date().toISOString(),
        productId: p.id,
        movementType: 'In',
        quantity: item.quantity,
        reference: po.reference
      })
    })

    setProducts(updatedProducts)
    setStockLedger(prev => [...prev, ...newLedger])
    toast.success(`Purchase Order received. Stock increased.`)
  }

  const confirmManufacturingOrder = (orderId: string) => {
    setManufacturingOrders(prev => prev.map(mo => mo.id === orderId ? { ...mo, status: 'Confirmed' } : mo))
    
    const mo = manufacturingOrders.find(m => m.id === orderId)
    if (!mo || !mo.bomId) return

    const bom = boms.find(b => b.id === mo.bomId)
    if (!bom) return

    let updatedProducts = [...products]
    // Reserve components
    bom.components.forEach(comp => {
      const pIdx = updatedProducts.findIndex(p => p.id === comp.productId)
      if (pIdx === -1) return
      
      const requiredQty = comp.quantity * mo.quantityToProduce
      updatedProducts[pIdx] = {
        ...updatedProducts[pIdx],
        reservedQty: updatedProducts[pIdx].reservedQty + requiredQty
      }
    })

    setProducts(updatedProducts)
    toast.success(`Manufacturing Order confirmed. Components reserved.`)
  }

  const completeManufacturingOrder = (orderId: string) => {
    setManufacturingOrders(prev => prev.map(mo => mo.id === orderId ? { ...mo, status: 'Completed' } : mo))
    
    const mo = manufacturingOrders.find(m => m.id === orderId)
    if (!mo || !mo.bomId) return

    const bom = boms.find(b => b.id === mo.bomId)
    if (!bom) return

    let updatedProducts = [...products]
    let newLedger: StockLedgerEntry[] = []

    // Deduct components
    bom.components.forEach(comp => {
      const pIdx = updatedProducts.findIndex(p => p.id === comp.productId)
      if (pIdx === -1) return
      
      const requiredQty = comp.quantity * mo.quantityToProduce
      const p = updatedProducts[pIdx]
      updatedProducts[pIdx] = {
        ...p,
        onHandQty: p.onHandQty - requiredQty,
        reservedQty: Math.max(0, p.reservedQty - requiredQty)
      }

      newLedger.push({
        id: generateId('LED'),
        date: new Date().toISOString(),
        productId: p.id,
        movementType: 'Out',
        quantity: requiredQty,
        reference: mo.reference
      })
    })

    // Add finished good
    const fgIdx = updatedProducts.findIndex(p => p.id === mo.productId)
    if (fgIdx !== -1) {
      const fg = updatedProducts[fgIdx]
      updatedProducts[fgIdx] = {
        ...fg,
        onHandQty: fg.onHandQty + mo.quantityToProduce
      }
      newLedger.push({
        id: generateId('LED'),
        date: new Date().toISOString(),
        productId: fg.id,
        movementType: 'In',
        quantity: mo.quantityToProduce,
        reference: mo.reference
      })
    }

    setProducts(updatedProducts)
    setStockLedger(prev => [...prev, ...newLedger])
    toast.success(`Manufacturing Order completed. Finished good added to stock.`)
  }

  return (
    <ErpContext.Provider value={{
      products, boms, salesOrders, purchaseOrders, manufacturingOrders, stockLedger,
      activeOrderId, setActiveOrderId,
      confirmSalesOrder, deliverSalesOrder, confirmPurchaseOrder, receivePurchaseOrder,
      confirmManufacturingOrder, completeManufacturingOrder
    }}>
      {children}
    </ErpContext.Provider>
  )
}

export function useErp() {
  const context = useContext(ErpContext)
  if (context === undefined) {
    throw new Error('useErp must be used within an ErpProvider')
  }
  return context
}
