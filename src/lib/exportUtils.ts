export function downloadCsv(
  filename: string,
  rows: Record<string, string | number>[],
  headers: { key: string; label: string }[]
) {
  if (!rows.length) return

  const escape = (value: string | number) => {
    const str = String(value ?? '')
    // Escape double quotes by doubling them, wrap everything in quotes
    return `"${str.replace(/"/g, '""')}"`
  }

  const csvLines: string[] = []
  csvLines.push(headers.map((h) => escape(h.label)).join(','))
  for (const row of rows) {
    csvLines.push(headers.map((h) => escape(row[h.key] ?? '')).join(','))
  }

  const blob = new Blob([csvLines.join('\n')], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

