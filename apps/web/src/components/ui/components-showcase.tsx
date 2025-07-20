'use client';

import React from 'react';
import { Badge } from './badge';
import { Button } from './button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';
import { Input } from './input';
import { Label } from './label';
import { StatusBadge, StatusBadgeGroup } from './status-badge';
import { SkipLinks } from './skip-link';
import { ResponsiveNav, ResponsiveBreadcrumb } from './responsive-nav';
import {
  ResponsiveTable,
  ResponsiveStats,
  ResponsiveList,
} from './responsive-table';
import {
  validateAccessibility,
  petbookContrastRatios,
} from '@/lib/accessibility';

/**
 * PetBook Components Showcase
 *
 * This component demonstrates all the key UI components with their wireframes
 * and usage examples. It serves as both documentation and a testing ground
 * for the design system implementation.
 *
 * Accessibility features and responsive layouts are demonstrated throughout this showcase.
 */
export function ComponentsShowcase() {
  // Validate accessibility on component mount
  React.useEffect(() => {
    const validation = validateAccessibility();
    if (!validation.isValid) {
      console.warn('Accessibility issues found:', validation.issues);
    }
  }, []);

  // Sample data for responsive components
  const navItems = [
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'Appointments', href: '#appointments' },
    { label: 'Pets', href: '#pets' },
    { label: 'Settings', href: '#settings' },
  ];

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'Appointments', href: '#appointments' },
    { label: 'Details', href: '#details' },
  ];

  const tableData = [
    {
      id: 1,
      pet: 'Buddy',
      service: 'Grooming',
      status: 'completed',
      date: '2024-01-15',
    },
    {
      id: 2,
      pet: 'Max',
      service: 'Vaccination',
      status: 'in-progress',
      date: '2024-01-16',
    },
    {
      id: 3,
      pet: 'Luna',
      service: 'Checkup',
      status: 'queued',
      date: '2024-01-17',
    },
  ];

  const tableColumns = [
    { key: 'pet', label: 'Pet Name', mobile: true },
    { key: 'service', label: 'Service', mobile: true },
    {
      key: 'status',
      label: 'Status',
      mobile: true,
      render: (value: string) => (
        <StatusBadge status={value as any} size="sm" />
      ),
    },
    { key: 'date', label: 'Date', mobile: false },
  ];

  const stats = [
    { label: 'Total Pets', value: 156, description: 'Registered pets' },
    { label: 'Completed', value: 89, description: 'This month' },
    { label: 'In Progress', value: 12, description: 'Current' },
    { label: 'Queued', value: 5, description: 'Pending' },
  ];

  return (
    <>
      {/* Skip Links for keyboard navigation */}
      <SkipLinks />

      <div className="min-h-screen bg-petbook-background-primary p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <header id="navigation" className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-petbook-text-primary mb-2">
                  PetBook Design System
                </h1>
                <p className="text-petbook-text-secondary text-sm md:text-lg">
                  Component library and design tokens for the PetBook
                  application
                </p>
              </div>
              <ResponsiveNav items={navItems} aria-label="Main navigation" />
            </div>
          </header>

          {/* Main Content */}
          <main id="main-content">
            {/* Responsive Design Section */}
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-petbook-text-primary mb-6">
                Responsive Design Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-petbook-text-primary">
                    Breakpoints
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Mobile:</span>
                      <span className="font-mono">320px - 767px</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tablet:</span>
                      <span className="font-mono">768px - 1023px</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Desktop:</span>
                      <span className="font-mono">1024px+</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-petbook-text-primary">
                    Mobile-First Approach
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>• Start with mobile layouts</p>
                    <p>• Progressive enhancement</p>
                    <p>• Touch-optimized interactions</p>
                    <p>• Responsive typography</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Accessibility Section */}
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-petbook-text-primary mb-6">
                Accessibility Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-petbook-text-primary">
                    Color Contrast
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Primary on White:</span>
                      <span className="font-mono">
                        {petbookContrastRatios.primaryOnWhite.toFixed(1)}:1
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Text Primary on White:</span>
                      <span className="font-mono">
                        {petbookContrastRatios.textPrimaryOnWhite.toFixed(1)}:1
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Queued on White:</span>
                      <span className="font-mono">
                        {petbookContrastRatios.queuedOnWhite.toFixed(1)}:1
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-petbook-text-primary">
                    Keyboard Navigation
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>• All interactive elements are keyboard accessible</p>
                    <p>• Focus indicators are visible</p>
                    <p>• Logical tab order implemented</p>
                    <p>• Skip links available</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Responsive Navigation */}
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-petbook-text-primary mb-6">
                Responsive Navigation
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-petbook-text-primary mb-4">
                    Breadcrumb Navigation
                  </h3>
                  <ResponsiveBreadcrumb items={breadcrumbItems} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-petbook-text-primary mb-4">
                    Mobile Menu
                  </h3>
                  <div className="border border-petbook-border rounded-lg p-4">
                    <ResponsiveNav
                      items={navItems}
                      aria-label="Demo navigation"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Responsive Data Display */}
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-petbook-text-primary mb-6">
                Responsive Data Display
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-petbook-text-primary mb-4">
                    Statistics Cards
                  </h3>
                  <ResponsiveStats stats={stats} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-petbook-text-primary mb-4">
                    Responsive Table
                  </h3>
                  <ResponsiveTable
                    data={tableData}
                    columns={tableColumns}
                    aria-label="Appointments table"
                  />
                </div>
              </div>
            </section>

            {/* Color Palette */}
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-petbook-text-primary mb-6">
                Color Palette
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Brand Colors */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-petbook-text-secondary">
                    Brand Colors
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 bg-petbook-primary rounded border"
                        role="img"
                        aria-label="Primary brand color"
                      ></div>
                      <span className="text-sm text-petbook-text-primary">
                        Primary
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 bg-petbook-primary-dark rounded border"
                        role="img"
                        aria-label="Primary dark color"
                      ></div>
                      <span className="text-sm text-petbook-text-primary">
                        Primary Dark
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 bg-petbook-primary-light rounded border"
                        role="img"
                        aria-label="Primary light color"
                      ></div>
                      <span className="text-sm text-petbook-text-primary">
                        Primary Light
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Colors */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-petbook-text-secondary">
                    Status Colors
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 bg-status-queued rounded border"
                        role="img"
                        aria-label="Queued status color"
                      ></div>
                      <span className="text-sm text-petbook-text-primary">
                        Queued
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 bg-status-inProgress rounded border"
                        role="img"
                        aria-label="In progress status color"
                      ></div>
                      <span className="text-sm text-petbook-text-primary">
                        In Progress
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 bg-status-completed rounded border"
                        role="img"
                        aria-label="Completed status color"
                      ></div>
                      <span className="text-sm text-petbook-text-primary">
                        Completed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 bg-status-cancelled rounded border"
                        role="img"
                        aria-label="Cancelled status color"
                      ></div>
                      <span className="text-sm text-petbook-text-primary">
                        Cancelled
                      </span>
                    </div>
                  </div>
                </div>

                {/* Text Colors */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-petbook-text-secondary">
                    Text Colors
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 bg-petbook-text-primary rounded border"
                        role="img"
                        aria-label="Primary text color"
                      ></div>
                      <span className="text-sm text-petbook-text-primary">
                        Primary
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 bg-petbook-text-secondary rounded border"
                        role="img"
                        aria-label="Secondary text color"
                      ></div>
                      <span className="text-sm text-petbook-text-primary">
                        Secondary
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 bg-petbook-text-muted rounded border"
                        role="img"
                        aria-label="Muted text color"
                      ></div>
                      <span className="text-sm text-petbook-text-primary">
                        Muted
                      </span>
                    </div>
                  </div>
                </div>

                {/* Background Colors */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-petbook-text-secondary">
                    Background Colors
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 bg-petbook-background-primary rounded border"
                        role="img"
                        aria-label="Primary background color"
                      ></div>
                      <span className="text-sm text-petbook-text-primary">
                        Primary
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 bg-petbook-background-secondary rounded border"
                        role="img"
                        aria-label="Secondary background color"
                      ></div>
                      <span className="text-sm text-petbook-text-primary">
                        Secondary
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 bg-petbook-border rounded border"
                        role="img"
                        aria-label="Border color"
                      ></div>
                      <span className="text-sm text-petbook-text-primary">
                        Border
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Buttons */}
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-petbook-text-primary mb-6">
                Responsive Buttons
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Primary Buttons */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-petbook-text-primary">
                    Primary Buttons
                  </h3>
                  <div className="flex flex-wrap gap-2 md:gap-4">
                    <Button
                      variant="default"
                      size="sm"
                      aria-label="Small primary button"
                    >
                      Small
                    </Button>
                    <Button
                      variant="default"
                      size="default"
                      aria-label="Default primary button"
                    >
                      Default
                    </Button>
                    <Button
                      variant="default"
                      size="lg"
                      aria-label="Large primary button"
                    >
                      Large
                    </Button>
                    <Button
                      variant="default"
                      size="xl"
                      aria-label="Extra large primary button"
                    >
                      XL
                    </Button>
                  </div>
                </div>

                {/* Secondary Buttons */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-petbook-text-primary">
                    Secondary Buttons
                  </h3>
                  <div className="flex flex-wrap gap-2 md:gap-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      aria-label="Small secondary button"
                    >
                      Small
                    </Button>
                    <Button
                      variant="secondary"
                      size="default"
                      aria-label="Default secondary button"
                    >
                      Default
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      aria-label="Large secondary button"
                    >
                      Large
                    </Button>
                    <Button
                      variant="secondary"
                      size="xl"
                      aria-label="Extra large secondary button"
                    >
                      XL
                    </Button>
                  </div>
                </div>

                {/* Outline Buttons */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-petbook-text-primary">
                    Outline Buttons
                  </h3>
                  <div className="flex flex-wrap gap-2 md:gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label="Small outline button"
                    >
                      Small
                    </Button>
                    <Button
                      variant="outline"
                      size="default"
                      aria-label="Default outline button"
                    >
                      Default
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      aria-label="Large outline button"
                    >
                      Large
                    </Button>
                    <Button
                      variant="outline"
                      size="xl"
                      aria-label="Extra large outline button"
                    >
                      XL
                    </Button>
                  </div>
                </div>

                {/* Ghost Buttons */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-petbook-text-primary">
                    Ghost Buttons
                  </h3>
                  <div className="flex flex-wrap gap-2 md:gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Small ghost button"
                    >
                      Small
                    </Button>
                    <Button
                      variant="ghost"
                      size="default"
                      aria-label="Default ghost button"
                    >
                      Default
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      aria-label="Large ghost button"
                    >
                      Large
                    </Button>
                    <Button
                      variant="ghost"
                      size="xl"
                      aria-label="Extra large ghost button"
                    >
                      XL
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Status Badges */}
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-petbook-text-primary mb-6">
                Responsive Status Badges
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Individual Status Badges */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-petbook-text-primary">
                    Status Badges
                  </h3>
                  <div className="flex flex-wrap gap-2 md:gap-4">
                    <StatusBadge status="queued" aria-label="Status: Na fila" />
                    <StatusBadge
                      status="in-progress"
                      aria-label="Status: Em andamento"
                    />
                    <StatusBadge
                      status="completed"
                      aria-label="Status: Concluído"
                    />
                    <StatusBadge
                      status="cancelled"
                      aria-label="Status: Cancelado"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-4">
                    <StatusBadge
                      status="queued"
                      size="sm"
                      aria-label="Status: Na fila"
                    />
                    <StatusBadge
                      status="in-progress"
                      size="sm"
                      aria-label="Status: Em andamento"
                    />
                    <StatusBadge
                      status="completed"
                      size="sm"
                      aria-label="Status: Concluído"
                    />
                    <StatusBadge
                      status="cancelled"
                      size="sm"
                      aria-label="Status: Cancelado"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-4">
                    <StatusBadge
                      status="queued"
                      size="lg"
                      aria-label="Status: Na fila"
                    />
                    <StatusBadge
                      status="in-progress"
                      size="lg"
                      aria-label="Status: Em andamento"
                    />
                    <StatusBadge
                      status="completed"
                      size="lg"
                      aria-label="Status: Concluído"
                    />
                    <StatusBadge
                      status="cancelled"
                      size="lg"
                      aria-label="Status: Cancelado"
                    />
                  </div>
                </div>

                {/* Status Badge Group */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-petbook-text-primary">
                    Status Badge Group
                  </h3>
                  <StatusBadgeGroup
                    statuses={[
                      { status: 'queued', count: 5 },
                      { status: 'in-progress', count: 3 },
                      { status: 'completed', count: 12 },
                      { status: 'cancelled', count: 1 },
                    ]}
                    aria-label="Appointment status summary"
                  />
                </div>
              </div>
            </section>

            {/* Cards */}
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-petbook-text-primary mb-6">
                Responsive Cards
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Basic Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Card</CardTitle>
                    <CardDescription>
                      A simple card with header, content, and footer
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-petbook-text-secondary">
                      This is the main content area of the card. It can contain
                      any type of content.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="default"
                      size="sm"
                      aria-label="Action button"
                    >
                      Action
                    </Button>
                  </CardFooter>
                </Card>

                {/* Status Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Appointment Status</CardTitle>
                      <StatusBadge
                        status="in-progress"
                        aria-label="Status: Em andamento"
                      />
                    </div>
                    <CardDescription>
                      Current appointment information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-petbook-text-secondary">
                          Pet:
                        </span>
                        <span className="text-petbook-text-primary">Buddy</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-petbook-text-secondary">
                          Service:
                        </span>
                        <span className="text-petbook-text-primary">
                          Grooming
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-petbook-text-secondary">
                          Time:
                        </span>
                        <span className="text-petbook-text-primary">
                          2:00 PM
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label="Cancel appointment"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        aria-label="Reschedule appointment"
                        className="flex-1"
                      >
                        Reschedule
                      </Button>
                    </div>
                  </CardFooter>
                </Card>

                {/* KPI Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Today&apos;s Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div
                        className="text-2xl md:text-3xl font-bold text-petbook-primary mb-2"
                        aria-label="24 total appointments"
                      >
                        24
                      </div>
                      <p className="text-petbook-text-secondary text-sm">
                        Total appointments scheduled
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-petbook-text-secondary">
                          Completed
                        </span>
                        <span className="text-petbook-text-primary">12</span>
                      </div>
                      <div
                        className="w-full bg-petbook-background-primary rounded-full h-2"
                        role="progressbar"
                        aria-valuenow={50}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Progress: 50% completed"
                      >
                        <div
                          className="bg-status-completed h-2 rounded-full"
                          style={{ width: '50%' }}
                        ></div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </section>

            {/* Forms */}
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-petbook-text-primary mb-6">
                Responsive Forms
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-petbook-text-primary">
                    Input Fields
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        aria-describedby="email-help"
                      />
                      <p
                        id="email-help"
                        className="text-xs text-petbook-text-muted"
                      >
                        We&apos;ll never share your email with anyone else.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        aria-describedby="password-help"
                      />
                      <p
                        id="password-help"
                        className="text-xs text-petbook-text-muted"
                      >
                        Must be at least 8 characters long.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        aria-describedby="name-help"
                      />
                      <p
                        id="name-help"
                        className="text-xs text-petbook-text-muted"
                      >
                        Enter your first and last name.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form with Buttons */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-petbook-text-primary">
                    Form Actions
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="search">Search</Label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          id="search"
                          placeholder="Search appointments..."
                          aria-describedby="search-help"
                          className="flex-1"
                        />
                        <Button
                          variant="default"
                          aria-label="Search appointments"
                          className="w-full sm:w-auto"
                        >
                          Search
                        </Button>
                      </div>
                      <p
                        id="search-help"
                        className="text-xs text-petbook-text-muted"
                      >
                        Search by pet name, service, or date.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="filter">Filter</Label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          id="filter"
                          placeholder="Filter by status..."
                          aria-describedby="filter-help"
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          aria-label="Clear filters"
                          className="w-full sm:w-auto"
                        >
                          Clear
                        </Button>
                      </div>
                      <p
                        id="filter-help"
                        className="text-xs text-petbook-text-muted"
                      >
                        Filter by appointment status.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
