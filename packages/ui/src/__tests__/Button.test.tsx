import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole('button', { name: 'Click me' })
    ).toBeInTheDocument();
  });

  it('renders with variant prop', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-destructive');
  });

  it('renders with size prop', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button', { name: 'Small' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('h-9');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    button.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toBeDisabled();
  });
});
