import styles from './DataTable.module.css';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function DataTable({ 
  columns, 
  data, 
  onRowClick,
  sortColumn,
  sortDirection,
  onSort
}) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th 
                key={index}
                className={col.sortable ? styles.sortable : ''}
                onClick={() => col.sortable && onSort && onSort(col.key)}
                style={{ width: col.width }}
              >
                <div className={styles.thContent}>
                  {col.label}
                  {col.sortable && sortColumn === col.key && (
                    <span className={styles.sortIcon}>
                      {sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.emptyState}>
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex} 
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? styles.clickableRow : ''}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
