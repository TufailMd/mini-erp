import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Truck,
  Factory,
  GitBranch,
  FileText,
  History,
  Users,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    path: "/products",
    icon: Package,
  },
  {
    title: "Inventory",
    path: "/inventory",
    icon: Boxes,
  },
  {
    title: "Sales Orders",
    path: "/sales",
    icon: ShoppingCart,
  },
  {
    title: "Purchase Orders",
    path: "/purchase",
    icon: Truck,
  },
  {
    title: "Manufacturing",
    path: "/manufacturing",
    icon: Factory,
  },
  {
    title: "BOM",
    path: "/bom",
    icon: GitBranch,
  },
  {
    title: "Stock Ledger",
    path: "/stock-ledger",
    icon: FileText,
  },
  {
    title: "Audit Logs",
    path: "/audit-logs",
    icon: History,
  },
  {
    title: "Users",
    path: "/users",
    icon: Users,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];