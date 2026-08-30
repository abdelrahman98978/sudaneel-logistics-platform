// ============================================================
// Sudaneel Logistics - Certified Data Export Utilities
// Supports UTF-8 with BOM for flawless Arabic Excel compatibility
// ============================================================

export interface CsvColumn<T> {
  header: string;
  accessor: (item: T) => string | number | boolean | undefined | null;
}

/**
 * Exports an array of objects to a CSV file and triggers an automatic browser download.
 * Prepends UTF-8 BOM (\uFEFF) so Microsoft Excel opens Arabic text correctly without corrupt encoding.
 */
export function exportToCsv<T>(filename: string, columns: CsvColumn<T>[], data: T[]): void {
  if (!data || data.length === 0) {
    console.warn('exportToCsv: No data to export.');
    return;
  }

  // 1. Header row
  const headerRow = columns.map((col) => `"${col.header.replace(/"/g, '""')}"`).join(',');

  // 2. Data rows
  const rows = data.map((item) => {
    return columns
      .map((col) => {
        const val = col.accessor(item);
        if (val === undefined || val === null) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      })
      .join(',');
  });

  // 3. Assemble CSV with UTF-8 BOM
  const csvContent = '\uFEFF' + [headerRow, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // 4. Trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.endsWith('.csv') ? filename : `${filename}.csv`}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers clean browser print dialog with styled waybill / invoice output.
 */
export function printDocument(title: string): void {
  const originalTitle = document.title;
  document.title = title;
  window.print();
  document.title = originalTitle;
}
