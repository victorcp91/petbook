# PetBook Component Usage Guide

Quick reference for using PetBook UI components in your application.

## Quick Start

```tsx
import { Button, StatusBadge, Card, ResponsiveNav } from '@/components/ui'

// Basic usage
<Button variant="default" size="default">Click me</Button>
<StatusBadge status="completed" />
<ResponsiveNav items={navItems} />
```

## Component Examples

### Button

```tsx
// Primary action
<Button variant="default" size="lg">Save Changes</Button>

// Secondary action
<Button variant="outline" size="default">Cancel</Button>

// Destructive action
<Button variant="destructive" size="default">Delete</Button>

// Icon button
<Button variant="ghost" size="icon" aria-label="Close">
  <X className="h-4 w-4" />
</Button>
```

### StatusBadge

```tsx
// Basic status
<StatusBadge status="completed" />

// With custom text
<StatusBadge status="in-progress">Processing...</StatusBadge>

// Different sizes
<StatusBadge status="queued" size="sm" />
<StatusBadge status="completed" size="lg" />

// Status group
<StatusBadgeGroup
  statuses={[
    { status: 'queued', count: 5 },
    { status: 'completed', count: 12 },
  ]}
/>
```

### Card

```tsx
// Basic card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// KPI card
<Card>
  <CardHeader>
    <CardTitle>Today's Appointments</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-center">
      <div className="text-2xl font-bold text-petbook-primary">24</div>
      <p className="text-sm text-petbook-text-secondary">Total</p>
    </div>
  </CardContent>
</Card>
```

### ResponsiveNav

```tsx
const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Appointments', href: '/appointments' },
  { label: 'Pets', href: '/pets' },
]

<ResponsiveNav items={navItems} aria-label="Main navigation" />
```

### ResponsiveTable

```tsx
const tableData = [
  { id: 1, pet: 'Buddy', service: 'Grooming', status: 'completed' },
  { id: 2, pet: 'Max', service: 'Vaccination', status: 'in-progress' },
]

const tableColumns = [
  { key: 'pet', label: 'Pet Name', mobile: true },
  { key: 'service', label: 'Service', mobile: true },
  { key: 'status', label: 'Status', mobile: true, render: (value) => (
    <StatusBadge status={value} size="sm" />
  ) },
]

<ResponsiveTable
  data={tableData}
  columns={tableColumns}
  aria-label="Appointments table"
/>
```

### ResponsiveStats

```tsx
const stats = [
  { label: 'Total Pets', value: 156, description: 'Registered pets' },
  { label: 'Completed', value: 89, description: 'This month' },
  { label: 'In Progress', value: 12, description: 'Current' },
]

<ResponsiveStats stats={stats} />
```

## Best Practices

### Accessibility

- Always provide `aria-label` for icon buttons
- Use semantic HTML elements
- Ensure proper focus management
- Test with keyboard navigation

### Responsive Design

- Use responsive variants (sm, md, lg, xl)
- Test on different screen sizes
- Consider touch targets on mobile
- Use responsive spacing classes

### Performance

- Import only needed components
- Use React.memo for expensive components
- Lazy load when appropriate
- Optimize bundle size

### Styling

- Use PetBook design tokens
- Follow the 8px grid system
- Use consistent spacing
- Maintain brand colors

## Common Patterns

### Form Layout

```tsx
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

### Navigation Layout

```tsx
<header className="flex items-center justify-between p-4">
  <h1 className="text-xl font-bold">PetBook</h1>
  <ResponsiveNav items={navItems} />
</header>
```

### Data Display

```tsx
<div className="space-y-6">
  <ResponsiveStats stats={stats} />
  <ResponsiveTable data={tableData} columns={tableColumns} />
</div>
```

## Troubleshooting

### Common Issues

1. **Styling not applied**: Check Tailwind classes and component variants
2. **Responsive issues**: Test on actual devices, not just dev tools
3. **Accessibility problems**: Use browser dev tools to check contrast and ARIA

### Debug Tips

1. Use React DevTools to inspect component props
2. Check browser dev tools for CSS conflicts
3. Test keyboard navigation and screen readers
4. Validate ARIA attributes

## Design System

### Colors

- `petbook-primary`: Primary brand color
- `status-queued/in-progress/completed/cancelled`: Status colors
- `petbook-text-primary/secondary/muted`: Text colors

### Spacing

- Use Tailwind spacing scale (space-1, space-2, etc.)
- Follow 8px grid system
- Apply responsive spacing (p-4 md:p-6)

### Typography

- Use semantic heading hierarchy
- Apply responsive text sizing
- Maintain consistent line heights

---

For detailed documentation, see the full README.md file.
