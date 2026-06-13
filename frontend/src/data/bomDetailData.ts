import type { BOMDetailData } from '@/types'

export const bomDetailData: BOMDetailData = {
  reference: 'BOM-000001',
  status: 'Draft',
  finishedProduct: 'Industrial Motor Housing Unit V2',
  quantity: 1,
  uom: 'Unit',
  notes: '',
  components: [
    { id:'1', product:'Steel Plate 304L', description:'Flat steel plate, 2mm thickness', quantity:4, uom:'Kg', cost:120.00 },
    { id:'2', product:'Copper Winding Wire', description:'Enameled copper 18AWG', quantity:200, uom:'Meters', cost:85.50 },
    { id:'3', product:'Bearing Assembly 6205', description:'Deep groove ball bearing', quantity:2, uom:'Units', cost:45.00 },
    { id:'4', product:'Thermal Paste TG-7', description:'High conductivity thermal compound', quantity:1, uom:'Tube', cost:12.00 },
    { id:'5', product:'M6 Hex Bolts SS', description:'Stainless steel hex bolts', quantity:24, uom:'Units', cost:0.75 },
  ],
  operations: [
    { id:'1', workCenter:'CNC Machining', operation:'Cut & Shape Housing', duration:'4h 30m', description:'CNC milling of housing body' },
    { id:'2', workCenter:'Assembly Line A', operation:'Motor Assembly', duration:'6h 00m', description:'Full motor winding and assembly' },
    { id:'3', workCenter:'Quality Assurance', operation:'Final Inspection', duration:'1h 30m', description:'Quality check and certification' },
  ],
  createdBy: 'Alex Grekov',
  createdDate: 'Jun 10, 2024',
  lastModified: '2 hours ago',
  auditLogs: [
    { id:'1', action:'BOM Created', user:'Alex Grekov', date:'Jun 10, 2024 • 09:15 AM' },
    { id:'2', action:'Added 3 components', user:'Alex Grekov', date:'Jun 10, 2024 • 09:30 AM' },
    { id:'3', action:'Added 2 operations', user:'Maria Rossi', date:'Jun 11, 2024 • 14:20 PM' },
    { id:'4', action:'Status changed to Active', user:'Alex Grekov', date:'Jun 12, 2024 • 10:00 AM' },
  ],
}

export const finishedProductOptions = [
  'Industrial Motor Housing Unit V2',
  'Hydraulic Pump Assembly Kit',
  'Precision Steel Bearings Set',
  'Custom Aluminum Extrusion X-7',
  'Stainless Steel Valve Body',
  'PCB Control Module Rev C',
  'Door Frames',
]

export const uomOptions = ['Unit', 'Units', 'Kg', 'Meters', 'Liters', 'Tube', 'Set']
