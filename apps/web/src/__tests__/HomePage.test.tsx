import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../app/page';

// Mock Next.js components
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
}));

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(<HomePage />);
    // Basic test to ensure the component renders
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('displays welcome message', () => {
    render(<HomePage />);
    // This test will need to be updated based on actual content
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
