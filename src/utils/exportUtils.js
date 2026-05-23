import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatCurrency, formatDate } from '@/lib/utils'

export function exportToCSV(transactions, filename = 'smart-ledger-transactions') {
  const headers = ['Date', 'Title', 'Category', 'Type', 'Amount', 'Notes']
  const rows = transactions.map((t) => [
    formatDate(t.date),
    t.title,
    t.category,
    t.type,
    t.amount,
    t.notes || '',
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function exportToPDF(transactions, stats, filename = 'smart-ledger-report') {
  const doc = new jsPDF()

  // Header
  doc.setFillColor(99, 102, 241)
  doc.rect(0, 0, 210, 40, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('Smart Ledger', 14, 20)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('Financial Report', 14, 30)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 140, 30)

  // Stats summary
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('Summary', 14, 55)

  const summaryData = [
    ['Total Income', formatCurrency(stats.income)],
    ['Total Expenses', formatCurrency(stats.expense)],
    ['Net Balance', formatCurrency(stats.balance)],
  ]

  autoTable(doc, {
    startY: 60,
    head: [['Metric', 'Amount']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 10 },
    columnStyles: { 1: { halign: 'right' } },
    margin: { left: 14, right: 14 },
  })

  // Transactions table
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('Transactions', 14, doc.lastAutoTable.finalY + 15)

  const tableData = transactions.map((t) => [
    formatDate(t.date),
    t.title,
    t.category,
    t.type.charAt(0).toUpperCase() + t.type.slice(1),
    formatCurrency(t.amount),
    t.notes || '-',
  ])

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [['Date', 'Title', 'Category', 'Type', 'Amount', 'Notes']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 9 },
    columnStyles: { 4: { halign: 'right' } },
    margin: { left: 14, right: 14 },
    didParseCell: (data) => {
      if (data.column.index === 3) {
        if (data.cell.raw === 'Income') {
          data.cell.styles.textColor = [16, 185, 129]
        } else {
          data.cell.styles.textColor = [239, 68, 68]
        }
      }
    },
  })

  doc.save(`${filename}.pdf`)
}
