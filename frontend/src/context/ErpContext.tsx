import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'react-hot-toast'
import type { 
  ErpProduct, BillOfMaterial, SalesOrder, PurchaseOrder, 
  ManufacturingOrder, StockLedgerEntry 
} from '@/types/erp'

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
  createProduct: (data: Partial<ErpProduct>) => Promise<void>
  createSalesOrder: (customerName: string, items: {productId: string, quantity: string|number, price: number}[]) => Promise<void>
  confirmSalesOrder: (orderId: string) => Promise<void>
  deliverSalesOrder: (orderId: string) => Promise<void>
  confirmPurchaseOrder: (orderId: string) => Promise<void>
  receivePurchaseOrder: (orderId: string) => Promise<void>
  confirmManufacturingOrder: (orderId: string) => Promise<void>
  completeManufacturingOrder: (orderId: string) => Promise<void>
}

const ErpContext = createContext<ErpContextType | undefined>(undefined)

export function ErpProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ErpProduct[]>([])
  const [boms, setBoms] = useState<BillOfMaterial[]>([])
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [manufacturingOrders, setManufacturingOrders] = useState<ManufacturingOrder[]>([])
  const [stockLedger, setStockLedger] = useState<StockLedgerEntry[]>([])

  const [activeOrderId, setActiveOrderId] = useState<string | null>(null)

  // --- API HELPERS ---
  const API_BASE = 'http://localhost:5000/api'

  const getHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  }

  // Unwrap { success, data } envelope from standardized API responses
  const unwrap = async (res: Response) => {
    const json = await res.json()
    // Support both wrapped { success, data } and raw array/object responses
    if (json && typeof json === 'object' && 'success' in json) {
      if (!json.success) throw new Error(json.message || 'API Error')
      return json.data
    }
    return json // backward compat with any non-wrapped response
  }

  const fetchData = async () => {
    try {
      const headers = getHeaders()
      // Only fetch if authenticated
      if (!headers.Authorization) return

      const [pRes, sRes, mRes, poRes, bRes, slRes] = await Promise.all([
        fetch(`${API_BASE}/products`, { headers }),
        fetch(`${API_BASE}/sales`, { headers }),
        fetch(`${API_BASE}/manufacturing`, { headers }),
        fetch(`${API_BASE}/purchase`, { headers }),
        fetch(`${API_BASE}/boms`, { headers }),
        fetch(`${API_BASE}/stock-ledger`, { headers })
      ])

      if (pRes.ok) setProducts(await unwrap(pRes))
      if (sRes.ok) setSalesOrders(await unwrap(sRes))
      if (mRes.ok) setManufacturingOrders(await unwrap(mRes))
      if (poRes.ok) setPurchaseOrders(await unwrap(poRes))
      if (bRes.ok) setBoms(await unwrap(bRes))
      if (slRes.ok) setStockLedger(await unwrap(slRes))
    } catch (err) {
      console.error('Failed to fetch ERP data', err)
      toast.error('Failed to connect to backend')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const generateId = (prefix: string) => `${prefix}-${Math.floor(Math.random() * 10000)}`

  // --- CORE BUSINESS LOGIC ---

  const createProduct = async (data: Partial<ErpProduct>) => {
    try {
      const payload = {
        id: generateId('PRD'),
        code: data.code || generateId('PCODE'),
        name: data.name,
        salesPrice: data.salesPrice || 0,
        costPrice: data.costPrice || 0,
        onHandQty: data.onHandQty || 0,
        freeToUseQty: data.freeToUseQty || 0,
        procurementType: data.procurementType || 'MTS',
        procurementMethod: data.procurementMethod || 'Purchase',
        vendorId: data.vendorId
      };
      
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      })
      
      if (res.ok) {
        const newProduct = await unwrap(res)
        setProducts(prev => [newProduct, ...prev])
        toast.success(`Product ${newProduct.name} saved!`)
      } else {
        const json = await res.json().catch(() => null)
        const msg = json?.message || `Failed to save: ${res.status}`
        throw new Error(msg)
      }
    } catch (err: any) {
      toast.error(err.message || 'Network Error')
      throw err
    }
  }

  const createSalesOrder = async (customerName: string, items: {productId: string, quantity: string|number, price: number}[]) => {
    const payload = {
      id: generateId('SO'),
      reference: generateId('SO-REF'),
      customerName,
      items: items.map(i => ({
        id: generateId('ITEM'),
        productId: i.productId,
        quantity: Number(i.quantity),
        price: i.price
      }))
    }

    try {
      const res = await fetch(`${API_BASE}/sales`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const newOrder = await unwrap(res)
        setSalesOrders(prev => [newOrder, ...prev])
        setActiveOrderId(newOrder.id)
        toast.success(`Draft Sales Order ${newOrder.reference} created`)
        return Promise.resolve()
      } else {
        const json = await res.json().catch(() => null)
        throw new Error(json?.message || `Failed to create order: ${res.status}`)
      }
    } catch (err: any) {
      toast.error(err.message || 'Network Error')
      return Promise.reject(err)
    }
  }

  const confirmSalesOrder = async (orderId: string) => {
    try {
      const res = await fetch(`${API_BASE}/sales/${orderId}/confirm`, {
        method: 'PUT',
        headers: getHeaders()
      })
      if (res.ok) {
        toast.success('Order confirmed and procurement auto-triggered (if needed)')
        fetchData()
      } else {
        const json = await res.json().catch(() => null)
        toast.error(json?.message || 'Failed to confirm order')
      }
    } catch (err) {
      toast.error('Network Error')
    }
  }

  const deliverSalesOrder = async (orderId: string) => {
    try {
      const res = await fetch(`${API_BASE}/sales/${orderId}/deliver`, {
        method: 'PUT',
        headers: getHeaders()
      })
      if (res.ok) {
        toast.success('Sales Order delivered. Stock deducted.')
        fetchData()
      } else {
        const json = await res.json().catch(() => null)
        toast.error(json?.message || 'Failed to deliver order')
      }
    } catch (err) {
      toast.error('Network Error')
    }
  }

  const confirmPurchaseOrder = async (orderId: string) => {
    try {
      const res = await fetch(`${API_BASE}/purchase/${orderId}/confirm`, {
        method: 'PUT',
        headers: getHeaders()
      })
      if (res.ok) {
        toast.success('Purchase Order confirmed.')
        fetchData()
      } else {
        const json = await res.json().catch(() => null)
        toast.error(json?.message || 'Failed to confirm')
      }
    } catch (err) {
      toast.error('Network Error')
    }
  }

  const receivePurchaseOrder = async (orderId: string) => {
    try {
      const res = await fetch(`${API_BASE}/purchase/${orderId}/receive`, {
        method: 'PUT',
        headers: getHeaders()
      })
      if (res.ok) {
        toast.success('Purchase Order received. Stock increased.')
        fetchData()
      } else {
        const json = await res.json().catch(() => null)
        toast.error(json?.message || 'Failed to receive')
      }
    } catch (err) {
      toast.error('Network Error')
    }
  }

  const confirmManufacturingOrder = async (orderId: string) => {
    try {
      const res = await fetch(`${API_BASE}/manufacturing/${orderId}/confirm`, {
        method: 'PUT',
        headers: getHeaders()
      })
      if (res.ok) {
        toast.success('Manufacturing Order confirmed.')
        fetchData()
      } else {
        const json = await res.json().catch(() => null)
        toast.error(json?.message || 'Failed to confirm')
      }
    } catch (err) {
      toast.error('Network Error')
    }
  }

  const completeManufacturingOrder = async (orderId: string) => {
    try {
      const res = await fetch(`${API_BASE}/manufacturing/${orderId}/complete`, {
        method: 'PUT',
        headers: getHeaders()
      })
      if (res.ok) {
        toast.success('Manufacturing Order completed.')
        fetchData()
      } else {
        const json = await res.json().catch(() => null)
        toast.error(json?.message || 'Failed to complete')
      }
    } catch (err) {
      toast.error('Network Error')
    }
  }

  return (
    <ErpContext.Provider value={{
      products, boms, salesOrders, purchaseOrders, manufacturingOrders, stockLedger,
      activeOrderId, setActiveOrderId,
      createProduct,
      createSalesOrder, confirmSalesOrder, deliverSalesOrder, confirmPurchaseOrder, receivePurchaseOrder,
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
