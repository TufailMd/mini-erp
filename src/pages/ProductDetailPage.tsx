import { useState, useEffect } from 'react'
import ErpSidebar from '../components/sales/ErpSidebar'
import ProductDetailHeader from '../components/products/ProductDetailHeader'
import ProductDetailActions from '../components/products/ProductDetailActions'
import ProductForm from '../components/products/ProductForm'
import RecordInfo from '../components/products/RecordInfo'
import RecentLogs from '../components/products/RecentLogs'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { erpNavItems, erpFooterNavItems } from '../data/salesData'
import { productDetailData } from '../data/productDetailData'
import type { PageProps, ProcurementConfig } from '../types'

export default function ProductDetailPage({ onNavigate }: PageProps) {
  const [loading, setLoading] = useState(true)

  // Form state
  const [productName, setProductName] = useState(
    productDetailData.productName,
  )
  const [salesPrice, setSalesPrice] = useState(productDetailData.salesPrice)
  const [costPrice, setCostPrice] = useState(productDetailData.costPrice)
  const [isDraft, setIsDraft] = useState(productDetailData.isDraft)
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
    onNavigate('products')
    console.log('Cancelled')
  }

  const handleSave = () => {
    setIsDraft(false)
    console.log('Record saved:', { productName, salesPrice, costPrice })
  }

  const handleButtonClick = () => {
    console.log('clicked')
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
                  onHandQty={productDetailData.inventory[0].value}
                  freeToUseQty={productDetailData.inventory[1].value}
                  procurement={procurement}
                  onProductNameChange={setProductName}
                  onSalesPriceChange={handleSalesPriceChange}
                  onCostPriceChange={handleCostPriceChange}
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
