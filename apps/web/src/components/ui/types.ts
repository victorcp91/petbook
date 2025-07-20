import * as React from 'react';

// Button Types
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'icon' | 'icon-sm' | 'icon-lg';
  asChild?: boolean;
}

// Badge Types
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'queued'
    | 'in-progress'
    | 'completed'
    | 'cancelled'
    | 'petbook-primary'
    | 'petbook-secondary';
  size?: 'default' | 'sm' | 'lg' | 'xl';
  'aria-label'?: string;
  'aria-describedby'?: string;
}

// StatusBadge Types
export interface StatusBadgeProps {
  status: 'queued' | 'in-progress' | 'completed' | 'cancelled';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

// ResponsiveNav Types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ResponsiveNavProps {
  items: NavItem[];
  className?: string;
  'aria-label'?: string;
}

// ResponsiveTable Types
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

// SkipLink Types
export interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}
