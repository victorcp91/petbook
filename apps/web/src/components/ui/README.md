# PetBook UI Components Documentation

This document provides comprehensive documentation for all PetBook UI components, including usage examples, props documentation, accessibility considerations, and responsive behavior.

## Table of Contents

- [Design System Overview](#design-system-overview)
- [Core Components](#core-components)
  - [Button](#button)
  - [StatusBadge](#statusbadge)
  - [Badge](#badge)
  - [Card](#card)
  - [Input](#input)
- [Responsive Components](#responsive-components)
  - [ResponsiveNav](#responsivenav)
  - [ResponsiveBreadcrumb](#responsivebreadcrumb)
  - [ResponsiveTable](#responsivetable)
  - [ResponsiveStats](#responsivestats)
  - [ResponsiveList](#responsivelist)
- [Accessibility Components](#accessibility-components)
  - [SkipLinks](#skiplinks)
  - [Accessibility Utilities](#accessibility-utilities)
- [Design System](#design-system)
- [Best Practices](#best-practices)

---

## Design System Overview

PetBook uses a comprehensive design system built on Tailwind CSS with custom design tokens that align with the PetBook brand identity.

### Color Palette

```typescript
// Brand Colors
petbook-primary: '#4F46E5'      // Primary brand color
petbook-primary-dark: '#3730A3' // Darker variant
petbook-primary-light: '#818CF8' // Lighter variant

// Status Colors
status-queued: '#F59E0B'        // Queued status
status-inProgress: '#3B82F6'    // In progress status
status-completed: '#10B981'     // Completed status
status-cancelled: '#EF4444'     // Cancelled status

// Text Colors
petbook-text-primary: '#1F2937'   // Primary text
petbook-text-secondary: '#6B7280' // Secondary text
petbook-text-muted: '#9CA3AF'     // Muted text

// Background Colors
petbook-background-primary: '#FFFFFF'   // Primary background
petbook-background-secondary: '#F9FAFB' // Secondary background
petbook-border: '#E5E7EB'               // Border color
```

### Typography Scale

```css
/* Responsive Typography */
text-xs: 0.75rem    /* 12px */
text-sm: 0.875rem   /* 14px */
text-base: 1rem     /* 16px */
text-lg: 1.125rem   /* 18px */
text-xl: 1.25rem    /* 20px */
text-2xl: 1.5rem    /* 24px */
text-3xl: 1.875rem  /* 30px */
text-4xl: 2.25rem   /* 36px */
```

### Spacing System

```css
/* 8px Grid System */
space-1: 0.25rem   /* 4px */
space-2: 0.5rem    /* 8px */
space-3: 0.75rem   /* 12px */
space-4: 1rem      /* 16px */
space-6: 1.5rem    /* 24px */
space-8: 2rem      /* 32px */
space-12: 3rem     /* 48px */
space-16: 4rem     /* 64px */
```

---

## Core Components

### Button

A versatile button component with multiple variants, sizes, and responsive behavior.

#### Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
```

#### Variants

- **default**: Primary button with brand colors
- **destructive**: Red button for destructive actions
- **outline**: Bordered button with transparent background
- **secondary**: Secondary button with muted colors
- **ghost**: Transparent button with hover effects
- **link**: Text button that looks like a link

#### Sizes

- **sm**: Small button (h-8 px-2 py-1 text-xs)
- **default**: Default button (h-9 px-3 py-2 text-sm md:h-10 md:px-4 md:text-base)
- **lg**: Large button (h-10 px-6 py-3 text-base md:h-11 md:px-8 md:text-lg)
- **xl**: Extra large button (h-12 px-8 py-4 text-lg md:h-14 md:px-10 md:text-xl)
- **icon**: Square icon button (h-8 w-8 md:h-10 md:w-10)
- **icon-sm**: Small icon button (h-6 w-6 md:h-8 md:w-8)
- **icon-lg**: Large icon button (h-10 w-10 md:h-12 md:w-12)

#### Usage Examples

```tsx
// Basic usage
<Button variant="default" size="default">
  Click me
</Button>

// Responsive button with different sizes
<Button variant="default" size="sm" className="md:size-lg">
  Responsive Button
</Button>

// Icon button
<Button variant="ghost" size="icon" aria-label="Close">
  <X className="h-4 w-4" />
</Button>

// Destructive action
<Button variant="destructive" size="lg">
  Delete Account
</Button>

// Link-style button
<Button variant="link" size="default">
  Learn More
</Button>
```

#### Accessibility Features

- Proper focus indicators with visible focus rings
- Keyboard navigation support
- ARIA labels for icon buttons
- Semantic HTML button element

#### Responsive Behavior

- Text size scales with screen size
- Touch targets optimized for mobile (minimum 44px)
- Icon sizes adjust for different screen sizes

---

### StatusBadge

A badge component for displaying status information with icons and responsive sizing.

#### Props

```typescript
interface StatusBadgeProps {
  status: 'queued' | 'in-progress' | 'completed' | 'cancelled';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
}
```

#### Status Types

- **queued**: Orange badge with clock icon
- **in-progress**: Blue badge with play circle icon
- **completed**: Green badge with check circle icon
- **cancelled**: Red badge with X circle icon

#### Usage Examples

```tsx
// Basic status badge
<StatusBadge status="completed" />

// Custom content
<StatusBadge status="in-progress">
  Processing...
</StatusBadge>

// Different sizes
<StatusBadge status="queued" size="sm" />
<StatusBadge status="completed" size="lg" />

// Without icon
<StatusBadge status="cancelled" showIcon={false} />

// With custom ARIA label
<StatusBadge
  status="in-progress"
  aria-label="Appointment status: In progress"
/>
```

#### StatusBadgeGroup

For displaying multiple status badges together:

```tsx
<StatusBadgeGroup
  statuses={[
    { status: 'queued', count: 5 },
    { status: 'in-progress', count: 3 },
    { status: 'completed', count: 12 },
    { status: 'cancelled', count: 1 },
  ]}
  aria-label="Appointment status summary"
/>
```

#### Accessibility Features

- Proper ARIA labels and descriptions
- Role="status" for screen readers
- Unique IDs for screen reader descriptions
- Icon accessibility with aria-hidden

---

### Badge

A versatile badge component with multiple variants and responsive sizing.

#### Props

```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
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
```

#### Variants

- **default**: Primary badge with brand colors
- **secondary**: Secondary badge with muted colors
- **destructive**: Red badge for destructive actions
- **outline**: Bordered badge with transparent background
- **queued/in-progress/completed/cancelled**: Status-specific colors
- **petbook-primary/petbook-secondary**: Brand-specific variants

#### Usage Examples

```tsx
// Basic badge
<Badge variant="default">New</Badge>

// Status badge
<Badge variant="completed">Completed</Badge>

// Different sizes
<Badge variant="secondary" size="sm">Small</Badge>
<Badge variant="outline" size="lg">Large</Badge>

// Brand variant
<Badge variant="petbook-primary">Featured</Badge>
```

---

### Card

A container component for displaying content in a structured layout.

#### Components

- `Card`: Main container
- `CardHeader`: Header section with title and description
- `CardTitle`: Card title
- `CardDescription`: Card description
- `CardContent`: Main content area
- `CardFooter`: Footer section with actions

#### Usage Examples

```tsx
// Basic card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Status card with badge
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Appointment Status</CardTitle>
      <StatusBadge status="in-progress" />
    </div>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Pet:</span>
        <span>Buddy</span>
      </div>
    </div>
  </CardContent>
</Card>

// KPI card
<Card>
  <CardHeader>
    <CardTitle>Today's Appointments</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-center">
      <div className="text-2xl font-bold text-petbook-primary">24</div>
      <p className="text-sm text-petbook-text-secondary">
        Total appointments
      </p>
    </div>
  </CardContent>
</Card>
```

#### Responsive Features

- Responsive padding (p-4 md:p-6)
- Responsive typography (text-lg md:text-2xl)
- Flexible layout for different screen sizes

---

### Input

A form input component with responsive sizing and accessibility features.

#### Props

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Extends all standard HTML input attributes
}
```

#### Usage Examples

```tsx
// Basic input
<Input type="email" placeholder="Enter your email" />

// With label
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>

// With validation
<Input
  type="password"
  placeholder="Enter password"
  aria-describedby="password-help"
/>
<p id="password-help" className="text-xs text-petbook-text-muted">
  Must be at least 8 characters
</p>

// Responsive form layout
<div className="flex flex-col sm:flex-row gap-2">
  <Input
    placeholder="Search..."
    className="flex-1"
  />
  <Button className="w-full sm:w-auto">Search</Button>
</div>
```

#### Accessibility Features

- Proper focus indicators
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility

---

## Responsive Components

### ResponsiveNav

A navigation component that adapts to different screen sizes with a mobile menu.

#### Props

```typescript
interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface ResponsiveNavProps {
  items: NavItem[];
  className?: string;
  'aria-label'?: string;
}
```

#### Usage Examples

```tsx
const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Appointments', href: '/appointments' },
  { label: 'Pets', href: '/pets' },
  { label: 'Settings', href: '/settings' },
]

// Basic usage
<ResponsiveNav items={navItems} aria-label="Main navigation" />

// With icons
const navItemsWithIcons = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Appointments', href: '/appointments', icon: Calendar },
]

<ResponsiveNav items={navItemsWithIcons} />
```

#### Features

- **Desktop**: Horizontal navigation
- **Mobile**: Hamburger menu with overlay
- **Keyboard Navigation**: Escape key to close mobile menu
- **Accessibility**: Proper ARIA labels and focus management

---

### ResponsiveBreadcrumb

A breadcrumb navigation component with responsive spacing.

#### Usage Examples

```tsx
const breadcrumbItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Appointments', href: '/appointments' },
  { label: 'Details', href: '/details' },
]

<ResponsiveBreadcrumb items={breadcrumbItems} />
```

#### Features

- Responsive spacing (space-x-1 md:space-x-2)
- Proper ARIA current page indication
- Semantic navigation structure

---

### ResponsiveTable

A table component that converts to cards on mobile devices.

#### Props

```typescript
interface TableColumn<T> {
  key: string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  mobile?: boolean; // Whether to show on mobile
  sortable?: boolean;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  className?: string;
  'aria-label'?: string;
}
```

#### Usage Examples

```tsx
const tableData = [
  { id: 1, pet: 'Buddy', service: 'Grooming', status: 'completed', date: '2024-01-15' },
  { id: 2, pet: 'Max', service: 'Vaccination', status: 'in-progress', date: '2024-01-16' },
]

const tableColumns = [
  { key: 'pet', label: 'Pet Name', mobile: true },
  { key: 'service', label: 'Service', mobile: true },
  { key: 'status', label: 'Status', mobile: true, render: (value) => (
    <StatusBadge status={value} size="sm" />
  ) },
  { key: 'date', label: 'Date', mobile: false },
]

<ResponsiveTable
  data={tableData}
  columns={tableColumns}
  aria-label="Appointments table"
/>
```

#### Features

- **Desktop**: Full table layout
- **Mobile**: Card-based layout with key information
- **Configurable**: Choose which columns show on mobile
- **Custom Rendering**: Render custom components in cells

---

### ResponsiveStats

A statistics display component with responsive grid layout.

#### Usage Examples

```tsx
const stats = [
  { label: 'Total Pets', value: 156, description: 'Registered pets' },
  { label: 'Completed', value: 89, description: 'This month' },
  { label: 'In Progress', value: 12, description: 'Current' },
  { label: 'Queued', value: 5, description: 'Pending' },
]

<ResponsiveStats stats={stats} />
```

#### Features

- Responsive grid (1 column mobile, 2 tablet, 4 desktop)
- Accessible statistics display
- Optional descriptions for context

---

### ResponsiveList

A flexible list component for rendering different data types.

#### Usage Examples

```tsx
const appointmentData = [
  { id: 1, pet: 'Buddy', time: '2:00 PM', status: 'completed' },
  { id: 2, pet: 'Max', time: '3:30 PM', status: 'in-progress' },
]

<ResponsiveList
  data={appointmentData}
  renderItem={(item, index) => (
    <div key={index} className="flex justify-between items-center p-4 border rounded">
      <div>
        <div className="font-medium">{item.pet}</div>
        <div className="text-sm text-petbook-text-secondary">{item.time}</div>
      </div>
      <StatusBadge status={item.status} />
    </div>
  )}
  aria-label="Appointments list"
/>
```

---

## Accessibility Components

### SkipLinks

Provides keyboard navigation shortcuts for accessibility.

#### Usage Examples

```tsx
// Include in your main layout
<SkipLinks />

// Custom skip links
<>
  <SkipLink href="#main-content" aria-label="Skip to main content">
    Skip to main content
  </SkipLink>
  <SkipLink href="#navigation" aria-label="Skip to navigation">
    Skip to navigation
  </SkipLink>
</>
```

#### Features

- Hidden by default, visible on focus
- Keyboard navigation support
- Proper ARIA labels

---

### Accessibility Utilities

Utility functions for managing focus and accessibility.

#### useFocusTrap

Traps focus within a container (useful for modals):

```tsx
const containerRef = useFocusTrap(isModalOpen);

return <div ref={containerRef}>{/* Modal content */}</div>;
```

#### useFocusOnMount

Focuses an element when the component mounts:

```tsx
const focusRef = useFocusOnMount();

return <input ref={focusRef} placeholder="Search..." />;
```

#### useFocusRestore

Restores focus when a component unmounts:

```tsx
useFocusRestore();
```

---

## Design System

### Color Usage Guidelines

#### Brand Colors

- Use `petbook-primary` for primary actions and brand elements
- Use `petbook-primary-dark` for hover states and emphasis
- Use `petbook-primary-light` for subtle backgrounds and highlights

#### Status Colors

- Use status colors consistently across the application
- Always pair status colors with appropriate icons
- Ensure sufficient contrast ratios for accessibility

#### Text Colors

- Use `petbook-text-primary` for main content
- Use `petbook-text-secondary` for supporting text
- Use `petbook-text-muted` for disabled or less important text

### Typography Guidelines

#### Headings

- Use semantic heading hierarchy (h1, h2, h3, etc.)
- Maintain consistent spacing between headings and content
- Use responsive typography for different screen sizes

#### Body Text

- Use appropriate line heights for readability
- Ensure sufficient contrast with background colors
- Use responsive text sizing for mobile devices

### Spacing Guidelines

#### Component Spacing

- Use the 8px grid system consistently
- Apply responsive spacing for different screen sizes
- Maintain visual hierarchy through spacing

#### Layout Spacing

- Use consistent margins and padding
- Apply responsive spacing for mobile and desktop
- Consider touch targets for mobile interactions

---

## Best Practices

### Component Usage

#### When to Use Each Component

**Button**

- Use for primary actions and form submissions
- Choose appropriate variants for different contexts
- Use icon buttons sparingly and always provide labels

**StatusBadge**

- Use for displaying status information
- Always include appropriate icons
- Use consistent colors across the application

**Card**

- Use for grouping related content
- Maintain consistent padding and spacing
- Use appropriate header and footer sections

**ResponsiveNav**

- Use for main navigation menus
- Provide clear, descriptive labels
- Ensure mobile menu is easily accessible

**ResponsiveTable**

- Use for displaying tabular data
- Choose appropriate columns for mobile display
- Provide meaningful column headers

#### Performance Considerations

1. **Lazy Loading**
   - Load components only when needed
   - Use React.lazy for code splitting

2. **Memoization**
   - Use React.memo for expensive components
   - Memoize callback functions with useCallback

3. **Bundle Size**
   - Import only necessary components
   - Use tree shaking for unused code

#### Accessibility Best Practices

1. **Semantic HTML**
   - Use appropriate HTML elements
   - Maintain proper heading hierarchy
   - Use ARIA attributes when necessary

2. **Keyboard Navigation**
   - Ensure all interactive elements are keyboard accessible
   - Provide visible focus indicators
   - Implement proper tab order

3. **Screen Reader Support**
   - Provide meaningful alt text for images
   - Use ARIA labels and descriptions
   - Test with screen readers

#### Responsive Design Best Practices

1. **Mobile-First Approach**
   - Start with mobile layouts
   - Progressive enhancement for larger screens
   - Test on actual devices

2. **Touch Targets**
   - Ensure minimum 44px touch targets
   - Provide adequate spacing between interactive elements
   - Consider thumb navigation patterns

3. **Performance**
   - Optimize images for different screen sizes
   - Use appropriate breakpoints
   - Test performance on slower devices

### Common Patterns

#### Form Patterns

```tsx
// Standard form layout
<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" required />
  </div>
  <div className="space-y-2">
    <Label htmlFor="password">Password</Label>
    <Input id="password" type="password" required />
  </div>
  <Button type="submit">Submit</Button>
</div>
```

#### Card Patterns

```tsx
// Information card
<Card>
  <CardHeader>
    <CardTitle>Information</CardTitle>
    <CardDescription>Additional details</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Cancel</Button>
    <Button>Confirm</Button>
  </CardFooter>
</Card>
```

#### Navigation Patterns

```tsx
// Main navigation
<ResponsiveNav items={navItems} aria-label="Main navigation" />

// Breadcrumb navigation
<ResponsiveBreadcrumb items={breadcrumbItems} />
```

### Troubleshooting

#### Common Issues

1. **Styling Conflicts**
   - Use Tailwind's `!important` modifier sparingly
   - Check for conflicting CSS classes
   - Use component-specific class names

2. **Responsive Issues**
   - Test on actual devices, not just browser dev tools
   - Check for overflow issues on small screens
   - Ensure touch targets are large enough

3. **Accessibility Issues**
   - Use browser dev tools to check contrast ratios
   - Test with keyboard navigation
   - Validate ARIA attributes

#### Debugging Tips

1. **Component Inspection**
   - Use React DevTools to inspect component props
   - Check for proper prop passing
   - Verify component hierarchy

2. **Styling Debug**
   - Use browser dev tools to inspect computed styles
   - Check for CSS specificity issues
   - Verify Tailwind classes are applied correctly

3. **Performance Debug**
   - Use React Profiler to identify performance issues
   - Check bundle size with webpack-bundle-analyzer
   - Monitor component re-renders

---

## Contributing

When adding new components or modifying existing ones:

1. **Follow the established patterns**
2. **Include comprehensive documentation**
3. **Add accessibility features**
4. **Test responsive behavior**
5. **Update this documentation**

### Documentation Standards

- Include TypeScript interfaces for all props
- Provide usage examples for all variants
- Document accessibility considerations
- Include responsive behavior notes
- Add troubleshooting sections when appropriate

---

This documentation is a living document and should be updated as the component library evolves.
