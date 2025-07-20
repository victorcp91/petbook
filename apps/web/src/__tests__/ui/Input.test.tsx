import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('should render with default props', () => {
    render(<Input />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass(
      'flex',
      'h-9',
      'w-full',
      'rounded-md',
      'border',
      'border-input'
    );
  });

  it('should render with placeholder text', () => {
    render(<Input placeholder="Enter your name" />);

    const input = screen.getByPlaceholderText('Enter your name');
    expect(input).toBeInTheDocument();
  });

  it('should render with value', () => {
    render(<Input value="John Doe" readOnly />);

    const input = screen.getByDisplayValue('John Doe');
    expect(input).toBeInTheDocument();
  });

  it('should handle user input', async () => {
    const user = userEvent.setup();
    render(<Input />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello World');

    expect(input).toHaveValue('Hello World');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('should be read-only when readOnly prop is true', () => {
    render(<Input readOnly />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');
  });

  it('should have proper type attribute', () => {
    render(<Input type="email" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should have proper name attribute', () => {
    render(<Input name="username" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('name', 'username');
  });

  it('should have proper id attribute', () => {
    render(<Input id="user-input" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'user-input');
  });

  it('should apply custom className', () => {
    render(<Input className="custom-input" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-input');
  });

  it('should forward ref correctly', () => {
    const ref = jest.fn();
    render(<Input ref={ref} />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it('should handle data attributes', () => {
    render(<Input data-testid="custom-input" />);

    expect(screen.getByTestId('custom-input')).toBeInTheDocument();
  });

  it('should handle aria attributes', () => {
    render(<Input aria-label="Username input" />);

    const input = screen.getByLabelText('Username input');
    expect(input).toBeInTheDocument();
  });

  it('should handle required attribute', () => {
    render(<Input required />);

    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('should handle min and max length', () => {
    render(<Input minLength={3} maxLength={10} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('minlength', '3');
    expect(input).toHaveAttribute('maxlength', '10');
  });

  it('should handle pattern attribute', () => {
    render(<Input pattern="[A-Za-z]{3}" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('pattern', '[A-Za-z]{3}');
  });

  it('should handle autoComplete attribute', () => {
    render(<Input autoComplete="email" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('autocomplete', 'email');
  });

  it('should handle spellCheck attribute', () => {
    render(<Input spellCheck={false} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('spellcheck', 'false');
  });

  it('should handle onChange event', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'a');

    expect(handleChange).toHaveBeenCalled();
  });

  it('should handle onFocus event', async () => {
    const handleFocus = jest.fn();
    const user = userEvent.setup();
    render(<Input onFocus={handleFocus} />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    expect(handleFocus).toHaveBeenCalled();
  });

  it('should handle onBlur event', async () => {
    const handleBlur = jest.fn();
    const user = userEvent.setup();
    render(<Input onBlur={handleBlur} />);

    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.tab();

    expect(handleBlur).toHaveBeenCalled();
  });

  it('should handle onKeyDown event', async () => {
    const handleKeyDown = jest.fn();
    const user = userEvent.setup();
    render(<Input onKeyDown={handleKeyDown} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'a');

    expect(handleKeyDown).toHaveBeenCalled();
  });

  it('should render with different input types', () => {
    const { rerender } = render(<Input type="text" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');

    rerender(<Input type="password" />);
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');

    rerender(<Input type="number" />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');

    rerender(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="tel" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'tel');
  });

  it('should handle multiple inputs without interference', () => {
    render(
      <div>
        <Input placeholder="First input" />
        <Input placeholder="Second input" />
      </div>
    );

    expect(screen.getByPlaceholderText('First input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Second input')).toBeInTheDocument();
  });

  it('should maintain focus state correctly', async () => {
    const user = userEvent.setup();
    render(<Input />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    expect(input).toHaveFocus();
  });

  it('should handle controlled component pattern', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Input value="" onChange={() => {}} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    // In a controlled component, the value should be managed by the parent
    expect(input).toHaveValue('');

    rerender(<Input value="updated" onChange={() => {}} />);
    expect(input).toHaveValue('updated');
  });
});
