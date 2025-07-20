import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
  it('should render with default props', () => {
    render(<Badge>Default Badge</Badge>);

    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
  });

  it('should render with different variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText('Default')).toBeInTheDocument();

    rerender(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary')).toBeInTheDocument();

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText('Destructive')).toBeInTheDocument();

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline')).toBeInTheDocument();
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Badge size="default">Default</Badge>);
    expect(screen.getByText('Default')).toBeInTheDocument();

    rerender(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small')).toBeInTheDocument();

    rerender(<Badge size="lg">Large</Badge>);
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Badge className="custom-badge">Custom</Badge>);

    const badge = screen.getByText('Custom');
    expect(badge).toBeInTheDocument();
  });

  it('should handle data attributes', () => {
    render(<Badge data-testid="custom-badge">Badge</Badge>);

    expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
  });

  it('should render with icon and text', () => {
    render(
      <Badge>
        <span data-testid="icon">🚀</span>
        Badge with icon
      </Badge>
    );

    expect(screen.getByText('Badge with icon')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should render multiple badges without interference', () => {
    render(
      <div>
        <Badge>First Badge</Badge>
        <Badge>Second Badge</Badge>
      </div>
    );

    expect(screen.getByText('First Badge')).toBeInTheDocument();
    expect(screen.getByText('Second Badge')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Badge onClick={handleClick}>Clickable Badge</Badge>);

    const badge = screen.getByText('Clickable Badge').parentElement;
    badge?.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should handle aria attributes', () => {
    render(<Badge aria-label="Status badge">Status</Badge>);

    const badge = screen.getByLabelText('Status badge');
    expect(badge).toBeInTheDocument();
  });

  it('should handle role attribute', () => {
    render(<Badge role="status">Status</Badge>);

    const badge = screen.getByRole('status');
    expect(badge).toBeInTheDocument();
  });

  it('should handle title attribute', () => {
    render(<Badge title="Tooltip text">Badge</Badge>);

    const badge = screen.getByTitle('Tooltip text');
    expect(badge).toBeInTheDocument();
  });

  it('should handle children with complex content', () => {
    render(
      <Badge>
        <span>Complex</span>
        <span>Content</span>
      </Badge>
    );

    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should handle numeric content', () => {
    render(<Badge>42</Badge>);

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should handle special characters', () => {
    render(<Badge>Badge with & special chars</Badge>);

    expect(screen.getByText('Badge with & special chars')).toBeInTheDocument();
  });

  it('should handle long text content', () => {
    const longText =
      'This is a very long badge text that might wrap to multiple lines';
    render(<Badge>{longText}</Badge>);

    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it('should handle conditional rendering', () => {
    const { rerender } = render(<Badge>{true && 'Visible'}</Badge>);
    expect(screen.getByText('Visible')).toBeInTheDocument();

    rerender(<Badge>{false && 'Hidden'}</Badge>);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('should handle dynamic variants', () => {
    const { rerender } = render(<Badge variant="default">Dynamic</Badge>);
    expect(screen.getByText('Dynamic')).toBeInTheDocument();

    rerender(<Badge variant="secondary">Dynamic</Badge>);
    expect(screen.getByText('Dynamic')).toBeInTheDocument();
  });

  it('should handle dynamic sizes', () => {
    const { rerender } = render(<Badge size="default">Dynamic</Badge>);
    expect(screen.getByText('Dynamic')).toBeInTheDocument();

    rerender(<Badge size="lg">Dynamic</Badge>);
    expect(screen.getByText('Dynamic')).toBeInTheDocument();
  });

  it('should handle empty content', () => {
    render(<Badge />);

    const badge = screen.getByRole('status');
    expect(badge).toBeInTheDocument();
  });

  it('should handle PetBook specific variants', () => {
    const { rerender } = render(<Badge variant="queued">Queued</Badge>);
    expect(screen.getByText('Queued')).toBeInTheDocument();

    rerender(<Badge variant="in-progress">In Progress</Badge>);
    expect(screen.getByText('In Progress')).toBeInTheDocument();

    rerender(<Badge variant="completed">Completed</Badge>);
    expect(screen.getByText('Completed')).toBeInTheDocument();

    rerender(<Badge variant="cancelled">Cancelled</Badge>);
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('should handle PetBook brand variants', () => {
    const { rerender } = render(
      <Badge variant="petbook-primary">Primary</Badge>
    );
    expect(screen.getByText('Primary')).toBeInTheDocument();

    rerender(<Badge variant="petbook-secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });
});
