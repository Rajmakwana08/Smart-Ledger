import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import {
  formatDateNumeric,
} from '@/lib/utils'

// =========================
// CLEAN CURRENCY FORMAT
// =========================

const formatAmount = (value) => {
  return Number(value).toLocaleString('en-IN')
}

// =========================
// EXPORT CSV
// =========================

export function exportToCSV(
  transactions,
  balanceMap,
  filename = 'transactions'
) {
  const headers = [
    'Transaction',
    'Category',
    'Date',
    'Income',
    'Expense',
    'Total Balance',
    'Notes',
  ]

  const rows = transactions.map((t) => {
    const income = t.type === 'income' ? t.amount : ''
    const expense = t.type === 'expense' ? t.amount : ''
    const balance = balanceMap ? balanceMap[t.id] : ''
    return [
      t.title,
      t.category,
      formatDateNumeric(t.date),
      income,
      expense,
      balance,
      t.notes || '',
    ]
  })

  const csvContent = [
    headers.join(','),

    ...rows.map((row) =>
      row
        .map((cell) =>
          `"${String(cell).replace(/"/g, '""')}"`
        )
        .join(',')
    ),
  ].join('\n')

  const blob = new Blob(
    [csvContent],
    {
      type: 'text/csv;charset=utf-8;',
    }
  )

  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')

  link.href = url
  link.download = `${filename}.csv`
  link.click()

  URL.revokeObjectURL(url)
}

// =========================
// EXPORT PDF
// =========================

export function exportToPDF(
  transactions,
  balanceMap,
  stats,
  title = 'Financial Report',
  filename = 'financial-report'
) {
  const doc = new jsPDF()

  // =========================
  // HEADER
  // =========================

  doc.setFillColor(99, 102, 241)

  doc.rect(0, 0, 210, 38, 'F')

  // USER TITLE ONLY
  doc.setTextColor(255, 255, 255)

  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')

  doc.text(title, 14, 18)

  // DATE
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  doc.text(
    `Generated: ${formatDateNumeric(new Date())}`,
    140,
    28
  )

  // =========================
  // SUMMARY
  // =========================

  doc.setTextColor(0, 0, 0)

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')

  doc.text('Summary', 14, 52)

  const summaryData = [
    [
      'Total Income',
      formatAmount(stats.income),
    ],

    [
      'Total Expenses',
      formatAmount(stats.expense),
    ],

    [
      'Net Balance',
      formatAmount(stats.balance),
    ],
  ]

  autoTable(doc, {
    startY: 58,

    head: [['Metric', 'Amount']],

    body: summaryData,

    theme: 'grid',

    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },

    styles: {
      fontSize: 10,
      cellPadding: 4,
    },

    columnStyles: {
      1: {
        halign: 'right',
      },
    },

    margin: {
      left: 14,
      right: 14,
    },
  })

  // =========================
  // TRANSACTION TITLE
  // =========================

  const tableStartY =
    doc.lastAutoTable.finalY + 18

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')

  doc.text(
    'Transactions',
    14,
    tableStartY
  )

  // =========================
  // BUILD TABLE DATA
  // =========================

  const tableData = transactions.map((t) => {
    return [
      t.title,
      t.category
        ? t.category.charAt(0).toUpperCase() +
          t.category.slice(1)
        : '-',
      formatDateNumeric(t.date),
      t.type === 'income'
        ? formatAmount(t.amount)
        : '-',
      t.type === 'expense'
        ? formatAmount(t.amount)
        : '-',
      formatAmount(balanceMap[t.id]),
      t.notes || '-',
    ]
  })

  // =========================
  // TRANSACTION TABLE
  // =========================

  autoTable(doc, {
    startY: tableStartY + 6,

    head: [[
      'Transaction',
      'Category',
      'Date',
      'Income',
      'Expense',
      'Total Balance',
      'Notes',
    ]],

    body: tableData,

    theme: 'striped',

    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },

    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
    },

    columnStyles: {

      // Income
      3: {
        halign: 'left',
        textColor: [16, 185, 129],
      },

      // Expense
      4: {
        halign: 'left',
        textColor: [239, 68, 68],
      },

      // Balance
      5: {
        halign: 'left',
        textColor: [37, 99, 235],
        fontStyle: 'bold',
      },
    },

    margin: {
      left: 14,
      right: 14,
    },
  })

  // =========================
  // SAVE PDF
  // =========================

  doc.save(`${filename}.pdf`)
}