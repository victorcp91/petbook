import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        // PetBook Status Variants
        queued:
          'border-transparent bg-status-queued text-status-queued-foreground',
        'in-progress':
          'border-transparent bg-status-inProgress text-status-inProgress-foreground',
        completed:
          'border-transparent bg-status-completed text-status-completed-foreground',
        cancelled:
          'border-transparent bg-status-cancelled text-status-cancelled-foreground',
        // PetBook Brand Variants
        'petbook-primary': 'border-transparent bg-petbook-primary text-white',
        'petbook-secondary':
          'border-transparent bg-petbook-background-secondary text-petbook-text-primary border-petbook-border',
      },
      size: {
        default: 'h-5 px-2 py-0.5 text-xs md:h-6 md:px-2.5 md:text-xs',
        sm: 'h-4 px-1.5 py-0 text-xs md:h-5 md:px-1.5 md:text-xs',
        lg: 'h-6 px-3 py-1 text-sm md:h-7 md:px-3 md:text-sm',
        xl: 'h-8 px-4 py-1.5 text-base md:h-9 md:px-5 md:text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  // Accessibility props
  'aria-label'?: string;
  'aria-describedby'?: string;
}

function Badge({
  className,
  variant,
  size,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  ...props
}: BadgeProps) {
  // Generate unique ID for screen reader description
  const descriptionId = React.useId();

  return (
    <div
      className={cn(badgeVariants({ variant, size, className }))}
      role="status"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby || descriptionId}
      {...props}
    >
      <span id={descriptionId}>{props.children}</span>
    </div>
  );
}

export { Badge, badgeVariants };
