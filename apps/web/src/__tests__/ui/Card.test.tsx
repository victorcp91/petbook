import { render, screen } from '@testing-library/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

describe('Card', () => {
  it('should render basic card with content', () => {
    render(
      <Card>
        <CardContent>
          <p>Card content</p>
        </CardContent>
      </Card>
    );

    expect(screen.getByText('Card content')).toBeInTheDocument();
    const card = screen.getByText('Card content').closest('div')?.parentElement;
    expect(card).toHaveClass(
      'rounded-lg',
      'border',
      'bg-card',
      'text-card-foreground',
      'shadow-sm'
    );
  });

  it('should render card with header', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content</p>
        </CardContent>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should render card with footer', () => {
    render(
      <Card>
        <CardContent>
          <p>Content</p>
        </CardContent>
        <CardFooter>
          <p>Footer content</p>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('should render complete card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Complete Card</CardTitle>
          <CardDescription>This is a complete card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content area</p>
        </CardContent>
        <CardFooter>
          <p>Footer area</p>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Complete Card')).toBeInTheDocument();
    expect(screen.getByText('This is a complete card')).toBeInTheDocument();
    expect(screen.getByText('Main content area')).toBeInTheDocument();
    expect(screen.getByText('Footer area')).toBeInTheDocument();
  });

  it('should apply custom className to card', () => {
    render(
      <Card className="custom-card">
        <CardContent>Content</CardContent>
      </Card>
    );

    const card = screen.getByText('Content').closest('div')?.parentElement;
    expect(card).toHaveClass('custom-card', 'rounded-lg', 'border', 'bg-card');
  });

  it('should apply custom className to card header', () => {
    render(
      <Card>
        <CardHeader className="custom-header">
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    );

    const header = screen.getByText('Title').closest('div');
    expect(header).toHaveClass('custom-header');
  });

  it('should apply custom className to card content', () => {
    render(
      <Card>
        <CardContent className="custom-content">
          <p>Content</p>
        </CardContent>
      </Card>
    );

    const content = screen.getByText('Content').closest('div');
    expect(content).toHaveClass('custom-content');
  });

  it('should apply custom className to card footer', () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
        <CardFooter className="custom-footer">
          <p>Footer</p>
        </CardFooter>
      </Card>
    );

    const footer = screen.getByText('Footer').closest('div');
    expect(footer).toHaveClass('custom-footer');
  });

  it('should render card title with proper styling', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Styled Title</CardTitle>
        </CardHeader>
      </Card>
    );

    const title = screen.getByText('Styled Title');
    expect(title).toHaveClass(
      'text-lg',
      'font-semibold',
      'leading-none',
      'tracking-tight',
      'md:text-2xl'
    );
  });

  it('should render card description with proper styling', () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription>Styled Description</CardDescription>
        </CardHeader>
      </Card>
    );

    const description = screen.getByText('Styled Description');
    expect(description).toHaveClass(
      'text-xs',
      'text-muted-foreground',
      'md:text-sm'
    );
  });

  it('should render card content with proper padding', () => {
    render(
      <Card>
        <CardContent>
          <p>Content</p>
        </CardContent>
      </Card>
    );

    const content = screen.getByText('Content').closest('div');
    expect(content).toHaveClass('p-4', 'pt-0', 'md:p-6', 'md:pt-0');
  });

  it('should render card footer with proper styling', () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
        <CardFooter>
          <p>Footer</p>
        </CardFooter>
      </Card>
    );

    const footer = screen.getByText('Footer').closest('div');
    expect(footer).toHaveClass(
      'flex',
      'items-center',
      'p-4',
      'pt-0',
      'md:p-6',
      'md:pt-0'
    );
  });

  it('should render card header with proper spacing', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
      </Card>
    );

    const header = screen.getByText('Title').closest('div');
    expect(header).toHaveClass(
      'flex',
      'flex-col',
      'space-y-1.5',
      'p-4',
      'md:p-6'
    );
  });

  it('should handle nested content properly', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Nested Card</CardTitle>
        </CardHeader>
        <CardContent>
          <div data-testid="nested-div">
            <p>Nested paragraph</p>
            <span>Nested span</span>
          </div>
        </CardContent>
      </Card>
    );

    expect(screen.getByTestId('nested-div')).toBeInTheDocument();
    expect(screen.getByText('Nested paragraph')).toBeInTheDocument();
    expect(screen.getByText('Nested span')).toBeInTheDocument();
  });

  it('should render multiple cards without interference', () => {
    render(
      <div>
        <Card>
          <CardContent>Card 1</CardContent>
        </Card>
        <Card>
          <CardContent>Card 2</CardContent>
        </Card>
      </div>
    );

    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
  });

  it('should forward ref correctly', () => {
    const ref = jest.fn();
    render(
      <Card ref={ref}>
        <CardContent>Content</CardContent>
      </Card>
    );

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it('should handle data attributes', () => {
    render(
      <Card data-testid="custom-card">
        <CardContent>Content</CardContent>
      </Card>
    );

    expect(screen.getByTestId('custom-card')).toBeInTheDocument();
  });
});
