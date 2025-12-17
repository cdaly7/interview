import { render, screen, fireEvent } from '@testing-library/react';
import { AutocompleteSearch } from '@/components/AutocompleteSearch';

describe('AutocompleteSearch', () => {
  const mockInputRef = { current: null };
  const mockOnChange = jest.fn();
  const mockOnKeyDown = jest.fn();
  const mockOnFocus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockInputRef.current = null;
  });

  describe('Rendering', () => {
    it('should render input element', () => {
      render(
        <AutocompleteSearch
          inputRef={mockInputRef}
          value=""
          onChange={mockOnChange}
          onKeyDown={mockOnKeyDown}
          onFocus={mockOnFocus}
          isLoading={false}
        />
      );

      const input = screen.getByPlaceholderText('Search words...');
      expect(input).toBeInTheDocument();
    });

    it('should have correct input attributes', () => {
      render(
        <AutocompleteSearch
          inputRef={mockInputRef}
          value=""
          onChange={mockOnChange}
          onKeyDown={mockOnKeyDown}
          onFocus={mockOnFocus}
          isLoading={false}
        />
      );

      const input = screen.getByPlaceholderText('Search words...') as HTMLInputElement;
      expect(input.type).toBe('text');
      expect(input.getAttribute('autocomplete')).toBe('off');
    });
  });

  describe('Value Display', () => {
    it('should display the current value', () => {
      const { rerender } = render(
        <AutocompleteSearch
          inputRef={mockInputRef}
          value=""
          onChange={mockOnChange}
          onKeyDown={mockOnKeyDown}
          onFocus={mockOnFocus}
          isLoading={false}
        />
      );

      let input = screen.getByPlaceholderText('Search words...') as HTMLInputElement;
      expect(input.value).toBe('');

      rerender(
        <AutocompleteSearch
          inputRef={mockInputRef}
          value="test"
          onChange={mockOnChange}
          onKeyDown={mockOnKeyDown}
          onFocus={mockOnFocus}
          isLoading={false}
        />
      );

      input = screen.getByPlaceholderText('Search words...') as HTMLInputElement;
      expect(input.value).toBe('test');
    });
  });

  describe('User Interactions', () => {
    it('should call onChange when input value changes', () => {
      render(
        <AutocompleteSearch
          inputRef={mockInputRef}
          value=""
          onChange={mockOnChange}
          onKeyDown={mockOnKeyDown}
          onFocus={mockOnFocus}
          isLoading={false}
        />
      );

      const input = screen.getByPlaceholderText('Search words...');
      fireEvent.change(input, { target: { value: 'hello' } });

      expect(mockOnChange).toHaveBeenCalledWith('hello');
    });

    it('should call onKeyDown when key is pressed', () => {
      render(
        <AutocompleteSearch
          inputRef={mockInputRef}
          value=""
          onChange={mockOnChange}
          onKeyDown={mockOnKeyDown}
          onFocus={mockOnFocus}
          isLoading={false}
        />
      );

      const input = screen.getByPlaceholderText('Search words...');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockOnKeyDown).toHaveBeenCalled();
    });

    it('should call onFocus when input is focused', () => {
      render(
        <AutocompleteSearch
          inputRef={mockInputRef}
          value=""
          onChange={mockOnChange}
          onKeyDown={mockOnKeyDown}
          onFocus={mockOnFocus}
          isLoading={false}
        />
      );

      const input = screen.getByPlaceholderText('Search words...');
      fireEvent.focus(input);

      expect(mockOnFocus).toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should not show spinner when not loading', () => {
      render(
        <AutocompleteSearch
          inputRef={mockInputRef}
          value=""
          onChange={mockOnChange}
          onKeyDown={mockOnKeyDown}
          onFocus={mockOnFocus}
          isLoading={false}
        />
      );

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).not.toBeInTheDocument();
    });

    it('should show spinner when loading', () => {
      render(
        <AutocompleteSearch
          inputRef={mockInputRef}
          value=""
          onChange={mockOnChange}
          onKeyDown={mockOnKeyDown}
          onFocus={mockOnFocus}
          isLoading={true}
        />
      );

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to input element', () => {
      const ref = { current: null };
      render(
        <AutocompleteSearch
          inputRef={ref}
          value=""
          onChange={mockOnChange}
          onKeyDown={mockOnKeyDown}
          onFocus={mockOnFocus}
          isLoading={false}
        />
      );

      const input = screen.getByPlaceholderText('Search words...');
      expect(ref.current).toBe(input);
    });
  });

  describe('Styling', () => {
    it('should have correct CSS classes', () => {
      render(
        <AutocompleteSearch
          inputRef={mockInputRef}
          value=""
          onChange={mockOnChange}
          onKeyDown={mockOnKeyDown}
          onFocus={mockOnFocus}
          isLoading={false}
        />
      );

      const input = screen.getByPlaceholderText('Search words...');
      expect(input).toHaveClass('w-full', 'px-5', 'py-3', 'text-lg', 'border-2');
    });
  });
});
