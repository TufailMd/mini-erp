import type { BOMListItem } from '../types'

export const bomStatCards = [
  { id: '1', label: 'Total BOMs', value: '48', sub: '+3 this week', subClass: 'text-green-600', iconClass: 'text-indigo-500' },
  { id: '2', label: 'Active BOMs', value: '36', sub: '75% of total', subClass: 'text-slate-500', iconClass: 'text-emerald-500' },
  { id: '3', label: 'Components Used', value: '284', sub: 'Across all BOMs', subClass: 'text-slate-500', iconClass: 'text-amber-500' },
  { id: '4', label: 'Avg Components', value: '5.9', sub: 'Per BOM', subClass: 'text-slate-500', iconClass: 'text-sky-500' },
]

export const bomItems: BOMListItem[] = [
  { id:'1', reference:'BOM-1102', product:'Industrial Motor Housing Unit V2', productCode:'PRD-MHU-V2', quantity:1, uom:'Unit', componentCount:8, operationCount:3, status:'Active', lastModified:'2 hours ago', createdBy:'Alex Grekov' },
  { id:'2', reference:'BOM-1098', product:'Hydraulic Pump Assembly Kit', productCode:'PRD-HPA-01', quantity:1, uom:'Unit', componentCount:12, operationCount:4, status:'Active', lastModified:'Yesterday', createdBy:'Maria Rossi' },
  { id:'3', reference:'BOM-0944', product:'Precision Steel Bearings Set', productCode:'PRD-PSB-25', quantity:100, uom:'Units', componentCount:4, operationCount:2, status:'Active', lastModified:'3 days ago', createdBy:'James Drake' },
  { id:'4', reference:'BOM-0881', product:'Custom Aluminum Extrusion X-7', productCode:'PRD-CAE-X7', quantity:1, uom:'Unit', componentCount:6, operationCount:3, status:'Draft', lastModified:'1 week ago', createdBy:'Suki Kawamura' },
  { id:'5', reference:'BOM-0875', product:'Stainless Steel Valve Body', productCode:'PRD-SSV-01', quantity:1, uom:'Unit', componentCount:5, operationCount:2, status:'Active', lastModified:'2 weeks ago', createdBy:'Leandro Perez' },
  { id:'6', reference:'BOM-0862', product:'PCB Control Module Rev C', productCode:'PRD-PCB-RC', quantity:1, uom:'Unit', componentCount:15, operationCount:5, status:'Archived', lastModified:'1 month ago', createdBy:'Alex Grekov' },
]

export const TOTAL_BOMS = 48
export const BOM_PAGE_SIZE = 10
