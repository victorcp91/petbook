import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  mobile?: boolean; // Whether to show on mobile
  sortable?: boolean;
}

export interface ResponsiveTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  className?: string;
  'aria-label'?: string;
}

export function ResponsiveTable<T extends Record<string, any>>({
  data,
  columns,
  className,
  'aria-label': ariaLabel,
}: ResponsiveTableProps<T>) {
  // Filter columns for mobile display
  const mobileColumns = columns.filter(col => col.mobile !== false);
  const desktopColumns = columns;

  return (
    <div className={cn('w-full', className)}>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table
          className="w-full border-collapse"
          role="table"
          aria-label={ariaLabel}
        >
          <thead>
            <tr className="border-b border-petbook-border">
              {desktopColumns.map(column => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-sm font-medium text-petbook-text-primary"
                  scope="col"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-petbook-border hover:bg-petbook-background-secondary transition-colors"
              >
                {desktopColumns.map(column => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-sm text-petbook-text-secondary"
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-petbook-border rounded-lg p-4 space-y-2"
          >
            {mobileColumns.map(column => (
              <div
                key={column.key}
                className="flex justify-between items-start"
              >
                <span className="text-xs font-medium text-petbook-text-secondary capitalize">
                  {column.label}
                </span>
                <div className="text-sm text-petbook-text-primary text-right">
                  {column.render
                    ? column.render(item[column.key], item)
                    : item[column.key]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResponsiveStats({
  stats,
}: {
  stats: Array<{ label: string; value: string | number; description?: string }>;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-petbook-border rounded-lg p-4 text-center"
          role="region"
          aria-label={`${stat.label} statistics`}
        >
          <div
            className="text-2xl font-bold text-petbook-primary mb-1"
            aria-label={`${stat.value} ${stat.label}`}
          >
            {stat.value}
          </div>
          <div className="text-sm text-petbook-text-secondary mb-1">
            {stat.label}
          </div>
          {stat.description && (
            <div className="text-xs text-petbook-text-muted">
              {stat.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ResponsiveList<T extends Record<string, any>>({
  data,
  renderItem,
  className,
  'aria-label': ariaLabel,
}: {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  'aria-label'?: string;
}) {
  return (
    <div
      className={cn('space-y-2', className)}
      role="list"
      aria-label={ariaLabel}
    >
      {data.map((item, index) => (
        <div key={index} role="listitem">
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
