import type { ComponentType } from 'react'
import type { PageId, PageProps } from '@/types'
import DashboardPage from '@/modules/dashboard/pages/DashboardPage'
import ProductsPage from '@/modules/products/pages/ProductsPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import SalesOrdersPage from '@/modules/sales/pages/SalesOrdersPage'
import SalesOrderDetailPage from '@/modules/sales/pages/SalesOrderDetailPage'
import SalesOrderCreatePage from '@/pages/SalesOrderCreatePage'
import PurchasePage from '@/modules/purchase/pages/PurchasePage'
import PurchaseOrderDetailPage from '@/modules/purchase/pages/PurchaseOrderDetailPage'
import ManufacturingPage from '@/modules/manufacturing/pages/ManufacturingPage'
import MOFormPage from '@/pages/MOFormPage'
import BOMListPage from '@/pages/BOMListPage'
import BOMDetailPage from '@/pages/BOMDetailPage'
import AuditLogsPage from '@/modules/audit/pages/AuditLogsPage'
import UserManagementListPage from '@/pages/UserManagementListPage'
import UserManagementDetailPage from '@/pages/UserManagementDetailPage'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import PlaceholderPage from '@/pages/PlaceholderPage'
import InventoryPage from '@/modules/inventory/pages/InventoryPage'
import StockLedgerPage from '@/modules/inventory/pages/StockLedgerPage'

export interface PageConfig {
  id: PageId
  label: string
  component: ComponentType<PageProps>
}

export const pageRegistry: PageConfig[] = [
  { id: 'dashboard', label: 'Dashboard', component: DashboardPage },
  { id: 'products', label: 'Products', component: ProductsPage },
  { id: 'product-detail', label: 'Product Detail', component: ProductDetailPage },
  { id: 'sales', label: 'Sales Orders', component: SalesOrdersPage },
  { id: 'sales-order-detail', label: 'Sales Order Detail', component: SalesOrderDetailPage },
  { id: 'sales-order-create', label: 'Sales Order Create', component: SalesOrderCreatePage },
  { id: 'purchase', label: 'Purchase / Vendor Hub', component: PurchasePage },
  { id: 'purchase-order-detail', label: 'Purchase Order Detail', component: PurchaseOrderDetailPage },
  { id: 'manufacturing', label: 'Manufacturing Orders', component: ManufacturingPage },
  { id: 'mo-form', label: 'Manufacturing Order Form', component: MOFormPage },
  { id: 'bom', label: 'Bills of Materials', component: BOMListPage },
  { id: 'bom-detail', label: 'BOM Detail Form', component: BOMDetailPage },
  { id: 'audit-logs', label: 'Audit Logs', component: AuditLogsPage },
  { id: 'user-management', label: 'User Management', component: UserManagementListPage },
  { id: 'user-management-detail', label: 'User Management Detail', component: UserManagementDetailPage },
  { id: 'login', label: 'Login', component: LoginPage },
  { id: 'signup', label: 'Sign Up', component: SignupPage },
  { id: 'forgot-password', label: 'Forgot Password', component: ForgotPasswordPage },
  { id: 'inventory', label: 'Inventory', component: InventoryPage },
  { id: 'stock-ledger', label: 'Stock Ledger', component: StockLedgerPage },
]

const implementedPages = new Map(
  pageRegistry.map((page) => [page.id, page.component]),
)

export function resolvePage(pageId: PageId): ComponentType<PageProps> {
  return implementedPages.get(pageId) ?? PlaceholderPage
}

export const defaultPageId: PageId = 'dashboard'

