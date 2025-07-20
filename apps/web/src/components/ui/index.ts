// Core Components
export { Button, buttonVariants } from './button';
export { Badge, badgeVariants } from './badge';
export { StatusBadge, StatusBadgeGroup } from './status-badge';
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './card';
export { Input } from './input';
export { Label } from './label';

// Responsive Components
export { ResponsiveNav, ResponsiveBreadcrumb } from './responsive-nav';
export {
  ResponsiveTable,
  ResponsiveStats,
  ResponsiveList,
} from './responsive-table';

// Accessibility Components
export { SkipLinks, SkipLink } from './skip-link';

// Accessibility Utilities
export {
  useFocusTrap,
  useFocusOnMount,
  useFocusRestore,
  validateAccessibility,
  petbookContrastRatios,
  getFocusableElements,
} from '@/lib/accessibility';

// Types
export type {
  ButtonProps,
  BadgeProps,
  StatusBadgeProps,
  ResponsiveNavProps,
  ResponsiveTableProps,
  TableColumn,
  NavItem,
  SkipLinkProps,
} from './types';
