import type { MOFormData } from '../types'

export const moFormData: MOFormData = {
  reference: 'MO-2024-012',
  status: 'Draft',
  finishedProduct: 'Industrial Motor Housing Unit V2',
  billOfMaterials: 'BOM-1102',
  quantityToProduce: 50,
  uom: 'Units',
  responsible: 'Alex Grekov',
  deadline: '28-06-2024',
  scheduledDate: '25-06-2024',
  sourceDocument: 'SO-2024-0891',
  components: [
    { id: '1', product: 'Steel Plate 304L', description: 'Flat steel plate, 2mm', quantity: 100, uom: 'Kg', status: 'Available' },
    { id: '2', product: 'Copper Winding Wire', description: 'Enameled copper 18AWG', quantity: 200, uom: 'Meters', status: 'Available' },
    { id: '3', product: 'Bearing Assembly 6205', description: 'Deep groove ball bearing', quantity: 50, uom: 'Units', status: 'Partially Available' },
    { id: '4', product: 'Thermal Paste TG-7', description: 'High conductivity thermal compound', quantity: 25, uom: 'Tubes', status: 'Not Available' },
  ],
  workOrders: [
    { id: '1', workCenter: 'CNC Machining', operation: 'Cut & Shape Housing', expectedDuration: '4h 30m', realDuration: '0h 0m', status: 'Pending' },
    { id: '2', workCenter: 'Assembly Line A', operation: 'Motor Assembly', expectedDuration: '6h 00m', realDuration: '0h 0m', status: 'Pending' },
    { id: '3', workCenter: 'Quality Assurance', operation: 'Final Inspection', expectedDuration: '1h 30m', realDuration: '0h 0m', status: 'Pending' },
  ],
  availability: 'partial',
  consumedQty: 0,
  producedQty: 0,
  notes: '',
}

export const productOptions = [
  'Industrial Motor Housing Unit V2',
  'Hydraulic Pump Assembly Kit',
  'Precision Steel Bearings Set',
  'Custom Aluminum Extrusion Profile X-7',
  'Stainless Steel Valve Body',
  'PCB Control Module Rev C',
]

export const bomOptions = ['BOM-1102', 'BOM-1098', 'BOM-0944', 'BOM-0881', 'BOM-0875', 'BOM-0862']

export const responsibleOptions = ['Alex Grekov', 'Maria Rossi', 'James Drake', 'Suki Kawamura', 'Leandro Perez']
