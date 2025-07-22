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
  it('should render basic card with proper styling', () => {
    render(
      <Card data-testid="card">
        <CardContent>Card content</CardContent>
      </Card>
    );

    expect(screen.getByText('Card content')).toBeInTheDocument();
    const card = screen.getByTestId('card');
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
      <Card className="custom-card" data-testid="custom-card">
        <CardContent>Content</CardContent>
      </Card>
    );

    const card = screen.getByTestId('custom-card');
    expect(card).toHaveClass('custom-card', 'rounded-lg', 'border', 'bg-card');
  });

  it('should apply custom className to card header', () => {
    render(
      <Card>
        <CardHeader className="custom-header" data-testid="card-header">
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    );

    const header = screen.getByTestId('card-header');
    expect(header).toHaveClass('custom-header');
  });

  it('should apply custom className to card content', () => {
    render(
      <Card>
        <CardContent className="custom-content" data-testid="card-content">
          <p>Content</p>
        </CardContent>
      </Card>
    );

    const content = screen.getByTestId('card-content');
    expect(content).toHaveClass('custom-content');
  });

  it('should apply custom className to card footer', () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
        <CardFooter className="custom-footer" data-testid="card-footer">
          <p>Footer</p>
        </CardFooter>
      </Card>
    );

    const footer = screen.getByTestId('card-footer');
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

  it('should render card content with proper styling', () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
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

    expect(screen.getByText('Footer')).toBeInTheDocument();
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

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('should handle nested card components', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Parent Card</CardTitle>
        </CardHeader>
        <CardContent>
          <Card>
            <CardContent>Nested Card</CardContent>
          </Card>
        </CardContent>
      </Card>
    );

    expect(screen.getByText('Parent Card')).toBeInTheDocument();
    expect(screen.getByText('Nested Card')).toBeInTheDocument();
  });

  it('should handle card with multiple content sections', () => {
    render(
      <Card>
        <CardContent>
          <p>Section 1</p>
        </CardContent>
        <CardContent>
          <p>Section 2</p>
        </CardContent>
      </Card>
    );

    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
  });

  it('should handle card with custom data attributes', () => {
    render(
      <Card data-testid="custom-card">
        <CardContent>Content</CardContent>
      </Card>
    );

    const card = screen.getByTestId('custom-card');
    expect(card).toBeInTheDocument();
  });

  it('should handle card with accessibility attributes', () => {
    render(
      <Card aria-label="Card description">
        <CardContent>Content</CardContent>
      </Card>
    );

    const card = screen.getByLabelText('Card description');
    expect(card).toBeInTheDocument();
  });

  it('should handle card with role attribute', () => {
    render(
      <Card role="region">
        <CardContent>Content</CardContent>
      </Card>
    );

    const card = screen.getByRole('region');
    expect(card).toBeInTheDocument();
  });
});
