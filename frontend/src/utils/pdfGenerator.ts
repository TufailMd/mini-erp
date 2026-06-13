import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface InvoiceData {
  reference: string
  status: string
  customerName: string
  billingAddress: string
  orderDate: string
  salesPerson: string
  lineItems: {
    product: string
    quantity: number
    price: number
    total: number
  }[]
  subtotal: number
  taxAmount: number
  total: number
}

export const generateInvoicePDF = (data: InvoiceData) => {
  const doc = new jsPDF()

  // --- BRANDING COLORS ---
  const PRIMARY_COLOR = [79, 70, 229] as [number, number, number] // Indigo-600
  const TEXT_COLOR = [51, 65, 85] as [number, number, number] // Slate-700
  const LIGHT_TEXT = [100, 116, 139] as [number, number, number] // Slate-500

  // --- HEADER ---
  // Logo placeholder
  doc.setFillColor(...PRIMARY_COLOR)
  doc.rect(14, 15, 12, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('N', 18, 23)

  // Company Name
  doc.setTextColor(...PRIMARY_COLOR)
  doc.setFontSize(18)
  doc.text('Nexus', 30, 23)
  doc.setTextColor(...TEXT_COLOR)
  doc.text('ERP', 51, 23)

  // Document Title
  doc.setFontSize(24)
  doc.setTextColor(...TEXT_COLOR)
  doc.text('INVOICE', 14, 45)

  // Document Info
  doc.setFontSize(10)
  doc.setTextColor(...LIGHT_TEXT)
  doc.text(`Reference: ${data.reference}`, 14, 55)
  doc.text(`Date: ${data.orderDate}`, 14, 61)
  doc.text(`Sales Rep: ${data.salesPerson}`, 14, 67)

  // Status Badge
  doc.setDrawColor(...PRIMARY_COLOR)
  doc.setTextColor(...PRIMARY_COLOR)
  doc.roundedRect(165, 45, 30, 8, 2, 2, 'D')
  doc.text(data.status.toUpperCase(), 168, 50)

  // --- BILL TO ---
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...TEXT_COLOR)
  doc.text('Bill To:', 14, 85)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(data.customerName, 14, 93)
  
  // Split address into multiple lines if needed
  const splitAddress = doc.splitTextToSize(data.billingAddress, 60)
  doc.text(splitAddress, 14, 99)

  // --- TABLE ---
  const tableData = data.lineItems.map(item => [
    item.product,
    item.quantity.toString(),
    `₹${item.price.toFixed(2)}`,
    `₹${item.total.toFixed(2)}`
  ])

  autoTable(doc, {
    startY: 120,
    head: [['Description', 'Qty', 'Unit Price', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: PRIMARY_COLOR,
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      textColor: TEXT_COLOR,
      fontSize: 10
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // slate-50
    },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' }
    }
  })

  // --- TOTALS ---
  const finalY = (doc as any).lastAutoTable.finalY || 120

  doc.setFontSize(10)
  doc.setTextColor(...LIGHT_TEXT)
  doc.text('Subtotal:', 140, finalY + 10)
  doc.text('Tax (10%):', 140, finalY + 16)
  
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...TEXT_COLOR)
  doc.text('Total Due:', 140, finalY + 24)

  // Values
  doc.setFont('helvetica', 'normal')
  doc.text(`₹${data.subtotal.toFixed(2)}`, 180, finalY + 10, { align: 'right' })
  doc.text(`₹${data.taxAmount.toFixed(2)}`, 180, finalY + 16, { align: 'right' })
  
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...PRIMARY_COLOR)
  doc.text(`₹${data.total.toFixed(2)}`, 180, finalY + 24, { align: 'right' })

  // --- FOOTER ---
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...LIGHT_TEXT)
  doc.text('Thank you for your business.', 105, 275, { align: 'center' })
  doc.text('Nexus ERP System • Generated Automatically', 105, 280, { align: 'center' })

  // Save the PDF
  doc.save(`${data.reference}_Invoice.pdf`)
}
