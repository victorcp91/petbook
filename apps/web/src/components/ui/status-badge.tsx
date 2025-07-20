import * as React from 'react';
import { Clock, CheckCircle, XCircle, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: 'queued' | 'in-progress' | 'completed' | 'cancelled';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  children?: React.ReactNode;
  // Accessibility props
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const statusConfig = {
  queued: {
    label: 'Na Fila',
    icon: Clock,
    className: 'bg-status-queued text-status-queued-foreground',
    ariaLabel: 'Status: Na fila',
  },
  'in-progress': {
    label: 'Em Andamento',
    icon: PlayCircle,
    className: 'bg-status-inProgress text-status-inProgress-foreground',
    ariaLabel: 'Status: Em andamento',
  },
  completed: {
    label: 'Concluído',
    icon: CheckCircle,
    className: 'bg-status-completed text-status-completed-foreground',
    ariaLabel: 'Status: Concluído',
  },
  cancelled: {
    label: 'Cancelado',
    icon: XCircle,
    className: 'bg-status-cancelled text-status-cancelled-foreground',
    ariaLabel: 'Status: Cancelado',
  },
};

const sizeConfig = {
  sm: 'h-4 px-1.5 py-0.5 text-xs md:h-5 md:px-2 md:text-xs',
  md: 'h-5 px-2 py-0.5 text-xs md:h-6 md:px-2.5 md:py-1 md:text-xs',
  lg: 'h-6 px-2.5 py-1 text-sm md:h-7 md:px-3 md:py-1.5 md:text-sm',
};

export function StatusBadge({
  status,
  size = 'md',
  showIcon = true,
  className,
  children,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  ...props
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  // Generate unique ID for screen reader description
  const descriptionId = React.useId();

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border-0 font-medium',
        config.className,
        sizeConfig[size],
        className
      )}
      role="status"
      aria-label={ariaLabel || config.ariaLabel}
      aria-describedby={ariaDescribedby || descriptionId}
      {...props}
    >
      {showIcon && (
        <Icon
          className="h-2.5 w-2.5 md:h-3 md:w-3"
          aria-hidden="true"
          role="img"
        />
      )}
      <span id={descriptionId}>{children || config.label}</span>
    </div>
  );
}

export function StatusBadgeGroup({
  statuses,
  size = 'md',
  showIcon = true,
  className,
  'aria-label': ariaLabel,
}: {
  statuses: Array<{ status: StatusBadgeProps['status']; count: number }>;
  size?: StatusBadgeProps['size'];
  showIcon?: boolean;
  className?: string;
  'aria-label'?: string;
}) {
  return (
    <div
      className={cn('flex flex-wrap gap-1 md:gap-2', className)}
      role="group"
      aria-label={ariaLabel || 'Status summary'}
    >
      {statuses.map(({ status, count }, index) => (
        <StatusBadge
          key={`${status}-${index}`}
          status={status}
          size={size}
          showIcon={showIcon}
          aria-label={`${statusConfig[status].label}: ${count} items`}
        >
          {count}
        </StatusBadge>
      ))}
    </div>
  );
}
