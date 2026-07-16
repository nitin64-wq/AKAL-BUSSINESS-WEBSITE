/* ============================================================
   ABS — Reusable DataTable Component
   Handles pagination, searching, sorting, and action controls.
   ============================================================ */

'use client';

import React, { useState, useMemo } from 'react';
import styles from './DataTable.module.css';
import { Search, ChevronDown, ChevronUp, Edit2, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui';

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  subtitle?: string;
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  addButton?: {
    label: string;
    onClick: () => void;
  };
  actionsColumnWidth?: string;
}

export function DataTable<T extends { id: number | string }>({
  title,
  subtitle,
  columns,
  data,
  searchPlaceholder = 'Search records...',
  searchKeys = [],
  onEdit,
  onDelete,
  addButton,
  actionsColumnWidth = '100px',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting Handler
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Searching logic
  const searchedData = useMemo(() => {
    if (!search.trim() || searchKeys.length === 0) return data;
    return data.filter((item) =>
      searchKeys.some((key) => {
        const val = item[key];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [data, search, searchKeys]);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortKey) return searchedData;
    const sorted = [...searchedData].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      // Detect if both values are numbers or numeric strings
      const aNum = Number(aVal);
      const bNum = Number(bVal);
      const isNumeric = 
        !isNaN(aNum) && 
        !isNaN(bNum) && 
        aVal !== '' && 
        bVal !== '' && 
        aVal !== null && 
        bVal !== null && 
        aVal !== undefined && 
        bVal !== undefined;

      if (isNumeric) {
        return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      // General fallback comparison
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      return sortOrder === 'asc'
        ? (aVal > bVal ? 1 : -1)
        : (aVal < bVal ? 1 : -1);
    });
    return sorted;
  }, [searchedData, sortKey, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const showActions = !!onEdit || !!onDelete;

  return (
    <div className={styles.wrapper}>
      {/* Header controls bar */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </div>

        <div className={styles.controls}>
          {searchKeys.length > 0 && (
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={16} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className={styles.searchInput}
              />
            </div>
          )}

          {addButton && (
            <Button variant="primary" size="sm" onClick={addButton.onClick} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <Plus size={16} /> {addButton.label}
            </Button>
          )}
        </div>
      </div>

      {/* Grid container */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                >
                  <div className={col.sortable ? styles.sortableHeader : undefined}>
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
              {showActions && <th style={{ width: actionsColumnWidth }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr key={row.id}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : (row[col.key as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                  {showActions && (
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        {onEdit && (
                          <button
                            className={`${styles.btnAction} ${styles.btnEdit}`}
                            onClick={() => onEdit(row)}
                            title="Edit Record"
                          >
                            <Edit2 className={styles.btnIcon} size={14} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            className={`${styles.btnAction} ${styles.btnDelete}`}
                            onClick={() => onDelete(row)}
                            title="Delete Record"
                          >
                            <Trash2 className={styles.btnIcon} size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className={styles.emptyState}
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className={styles.footer}>
        <div className={styles.paginationInfo}>
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} records
        </div>
        
        <div className={styles.paginationControls}>
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
