import type { ComponentType } from 'react'
import type { PageId, PageProps } from '../types'
import DashboardPage from '../pages/DashboardPage'
import ProductsPage from '../pages/ProductsPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import SalesOrdersPage from '../pages/SalesOrdersPage'
import SalesOrderDetailPage from '../pages/SalesOrderDetailPage'
import SalesOrderCreatePage from '../pages/SalesOrderCreatePage'
import PurchasePage from '../pages/PurchasePage'
import PurchaseOrderDetailPage from '../pages/PurchaseOrderDetailPage'
import ManufacturingPage from '../pages/ManufacturingPage'
import MOFormPage from '../pages/MOFormPage'
import BOMListPage from '../pages/BOMListPage'
import BOMDetailPage from '../pages/BOMDetailPage'
import AuditLogsPage from '../pages/AuditLogsPage'
import UserManagementListPage from '../pages/UserManagementListPage'
import UserManagementDetailPage from '../pages/UserManagementDetailPage'
import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import PlaceholderPage from '../pages/PlaceholderPage'

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
]

const implementedPages = new Map(
  pageRegistry.map((page) => [page.id, page.component]),
)

export function resolvePage(pageId: PageId): ComponentType<PageProps> {
  return implementedPages.get(pageId) ?? PlaceholderPage
}

export const defaultPageId: PageId = 'dashboard'

