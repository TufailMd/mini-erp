import { useState, useEffect } from 'react'
import ErpSidebar from '@/modules/sales/components/ErpSidebar'
import ProductDetailHeader from '@/modules/products/components/ProductDetailHeader'
import ProductDetailActions from '@/modules/products/components/ProductDetailActions'
import ProductForm from '@/modules/products/components/ProductForm'
import RecordInfo from '@/modules/products/components/RecordInfo'
import RecentLogs from '@/modules/products/components/RecentLogs'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { erpNavItems, erpFooterNavItems } from '@/data/salesData'
import { productDetailData } from '@/data/productDetailData'
import type { PageProps, ProcurementConfig } from '@/types'
import { toast } from 'react-hot-toast'
import { useErp } from '@/context/ErpContext'

export default function ProductDetailPage({ onNavigate }: PageProps) {
  const { createProduct } = useErp()
  const [loading, setLoading] = useState(true)

  // Form state
  const [productName, setProductName] = useState(
    productDetailData.productName,
  )
  const [salesPrice, setSalesPrice] = useState(productDetailData.salesPrice)
  const [costPrice, setCostPrice] = useState(productDetailData.costPrice)
  const [onHandQty, setOnHandQty] = useState(productDetailData.inventory[0].value)
  const [freeToUseQty, setFreeToUseQty] = useState(productDetailData.inventory[1].value)
  const [productImage, setProductImage] = useState<string | null>(null)
  const [procurement, setProcurement] = useState<ProcurementConfig>(
    productDetailData.procurement,
  )

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleBack = () => {
    onNavigate('products')
  }

  const handleCancel = () => {
    toast('Edit Cancelled')
    onNavigate('products')
  }

  const handleSave = async () => {
    try {
      await createProduct({
        name: productName,
        salesPrice: salesPrice,
        costPrice: costPrice,
        onHandQty: parseFloat(onHandQty) || 0,
        freeToUseQty: parseFloat(freeToUseQty) || 0,
        procurementType: procurement.procureOnDemand ? 'MTO' : 'MTS',
        procurementMethod: procurement.procurementType || 'Purchase',
        vendorId: procurement.vendor
      })
      onNavigate('products')
    } catch (err) {
      // Error handled in context
    }
  }

  const handleButtonClick = () => {
    toast('Action triggered')
  }

  const handleProcurementTypeChange = (type: 'Purchase' | 'Manufacturing') => {
    setProcurement((prev) => ({ ...prev, procurementType: type, vendor: undefined, bom: undefined }))
  }

  const handleVendorChange = (vendor: string) => {
    setProcurement((prev) => ({ ...prev, vendor }))
  }

  const handleBomChange = (bom: string) => {
    setProcurement((prev) => ({ ...prev, bom }))
  }

  const handleSalesPriceChange = (value: string) => {
    const num = parseFloat(value)
    if (!isNaN(num)) setSalesPrice(num)
  }

  const handleCostPriceChange = (value: string) => {
    const num = parseFloat(value)
    if (!isNaN(num)) setCostPrice(num)
  }

  const handleImageChange = (file: File) => {
    // Create object URL for preview
    const imageUrl = URL.createObjectURL(file)
    setProductImage(imageUrl)
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ErpSidebar
        navItems={erpNavItems}
        footerItems={erpFooterNavItems}
        activePage="products"
        onNavigate={onNavigate}
        onNewRecordClick={() => onNavigate('product-detail')}
      />

      <div className="ml-60 flex min-h-screen flex-col">
        <ProductDetailHeader
          productName={productName}
          reference={productDetailData.reference}
          onBack={handleBack}
          onButtonClick={handleButtonClick}
        />

        {loading ? (
          <LoadingSpinner className="mt-32" />
        ) : (
          <main className="flex-1 p-6">
            <ProductDetailActions
              onCancel={handleCancel}
              onSave={handleSave}
              onViewAudit={() => onNavigate('audit-logs')}
            />

            <div className="flex gap-6">
              {/* Main form area */}
              <div className="min-w-0 flex-1">
                <ProductForm
                  productName={productName}
                  salesPrice={salesPrice}
                  costPrice={costPrice}
                  onHandQty={onHandQty}
                  freeToUseQty={freeToUseQty}
                  productImage={productImage}
                  procurement={procurement}
                  onProductNameChange={setProductName}
                  onSalesPriceChange={handleSalesPriceChange}
                  onCostPriceChange={handleCostPriceChange}
                  onOnHandQtyChange={setOnHandQty}
                  onFreeToUseQtyChange={setFreeToUseQty}
                  onImageChange={handleImageChange}
                  onToggleProcurement={() => setProcurement(prev => ({ ...prev, procureOnDemand: !prev.procureOnDemand }))}
                  onProcurementTypeChange={handleProcurementTypeChange}
                  onVendorChange={handleVendorChange}
                  onBomChange={handleBomChange}
                />
              </div>

              {/* Right sidebar panels */}
              <div className="w-80 shrink-0 space-y-4">
                <RecordInfo record={productDetailData.record} />

                <RecentLogs
                  logs={productDetailData.logs}
                  onViewAll={() => onNavigate('audit-logs')}
                />
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  )
}
