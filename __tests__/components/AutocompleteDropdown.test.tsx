import { render, screen, fireEvent } from '@testing-library/react';
import { AutocompleteDropdown } from '@/components/AutocompleteDropdown';
import { Word } from '@/hooks/useAutocomplete';

describe('AutocompleteDropdown', () => {
  const mockResults: Word[] = [
    { word: 'apple', frequency: 100 },
    { word: 'application', frequency: 75 },
    { word: 'apply', frequency: 50 },
  ];

  const defaultProps = {
    results: mockResults,
    isOpen: true,
    isLoading: false,
    query: 'app',
    selectedIndex: -1,
    onSelect: jest.fn(),
    onMouseEnter: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(
        <AutocompleteDropdown {...defaultProps} isOpen={false} />
      );

      const dropdown = container.querySelector('.overflow-y-auto');
      expect(dropdown).not.toBeInTheDocument();
    });

    it('should render dropdown when isOpen is true', () => {
      const { container } = render(
        <AutocompleteDropdown {...defaultProps} isOpen={true} />
      );

      const dropdown = container.querySelector('.overflow-y-auto');
      expect(dropdown).toBeInTheDocument();
    });

    it('should render all results', () => {
      render(<AutocompleteDropdown {...defaultProps} />);

      expect(screen.getByText('apple')).toBeInTheDocument();
      expect(screen.getByText('application')).toBeInTheDocument();
      expect(screen.getByText('apply')).toBeInTheDocument();
    });
  });

  describe('Frequency Display', () => {
    it('should display frequency when available', () => {
      render(<AutocompleteDropdown {...defaultProps} />);

      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('should not display frequency badge when not available', () => {
      const resultsWithoutFreq: Word[] = [
        { word: 'apple' },
        { word: 'application' },
      ];

      render(
        <AutocompleteDropdown
          {...defaultProps}
          results={resultsWithoutFreq}
        />
      );

      const badges = document.querySelectorAll('.text-xs');
      expect(badges.length).toBe(0);
    });
  });

  describe('Loading State', () => {
    it('should show spinner when loading', () => {
      const { container } = render(
        <AutocompleteDropdown {...defaultProps} isLoading={true} />
      );

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should not show results when loading', () => {
      render(
        <AutocompleteDropdown {...defaultProps} isLoading={true} />
      );

      expect(screen.queryByText('apple')).not.toBeInTheDocument();
    });
  });

  describe('Empty Results', () => {
    it('should show no results message when results are empty and query exists', () => {
      render(
        <AutocompleteDropdown
          {...defaultProps}
          results={[]}
          isOpen={true}
          isLoading={false}
          query="xyz"
        />
      );

      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('should not show no results message when query is empty', () => {
      const { container } = render(
        <AutocompleteDropdown
          {...defaultProps}
          results={[]}
          isOpen={true}
          isLoading={false}
          query=""
        />
      );

      expect(screen.queryByText('No results found')).not.toBeInTheDocument();
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Selection Highlight', () => {
    it('should highlight selected item', () => {
      const { container } = render(
        <AutocompleteDropdown
          {...defaultProps}
          selectedIndex={1}
        />
      );

      const buttons = container.querySelectorAll('button');
      expect(buttons[1]).toHaveClass('bg-blue-500', 'text-white');
    });

    it('should not highlight when selectedIndex is -1', () => {
      const { container } = render(
        <AutocompleteDropdown
          {...defaultProps}
          selectedIndex={-1}
        />
      );

      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button).not.toHaveClass('bg-blue-500');
      });
    });

    it('should change highlight color in frequency badge when selected', () => {
      const { container } = render(
        <AutocompleteDropdown
          {...defaultProps}
          selectedIndex={0}
        />
      );

      const badges = container.querySelectorAll('.text-xs');
      expect(badges[0]).toHaveClass('bg-blue-400');
    });
  });

  describe('User Interactions', () => {
    it('should call onSelect when clicking a result', () => {
      const mockSelect = jest.fn();
      render(
        <AutocompleteDropdown
          {...defaultProps}
          onSelect={mockSelect}
        />
      );

      const appleButton = screen.getByText('apple').closest('button');
      fireEvent.click(appleButton!);

      expect(mockSelect).toHaveBeenCalledWith(mockResults[0]);
    });

    it('should call onMouseEnter when hovering over result', () => {
      const mockMouseEnter = jest.fn();
      render(
        <AutocompleteDropdown
          {...defaultProps}
          onMouseEnter={mockMouseEnter}
        />
      );

      const appleButton = screen.getByText('apple').closest('button');
      fireEvent.mouseEnter(appleButton!);

      expect(mockMouseEnter).toHaveBeenCalledWith(0);
    });

    it('should call onMouseEnter with correct index', () => {
      const mockMouseEnter = jest.fn();
      render(
        <AutocompleteDropdown
          {...defaultProps}
          onMouseEnter={mockMouseEnter}
        />
      );

      const applicationButton = screen.getByText('application').closest('button');
      fireEvent.mouseEnter(applicationButton!);

      expect(mockMouseEnter).toHaveBeenCalledWith(1);
    });
  });

  describe('String Results Support', () => {
    it('should handle string results', () => {
      const stringResults: Word[] = ['apple', 'application', 'apply'] as any;

      render(
        <AutocompleteDropdown
          {...defaultProps}
          results={stringResults}
        />
      );

      expect(screen.getByText('apple')).toBeInTheDocument();
      expect(screen.getByText('application')).toBeInTheDocument();
      expect(screen.getByText('apply')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have correct container classes', () => {
      const { container } = render(
        <AutocompleteDropdown {...defaultProps} />
      );

      const dropdown = container.querySelector('.overflow-y-auto');
      expect(dropdown).toHaveClass('absolute', 'top-full', 'bg-white', 'border-2');
    });

    it('should have correct button classes', () => {
      const { container } = render(
        <AutocompleteDropdown {...defaultProps} />
      );

      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('w-full', 'text-left', 'px-5', 'py-3');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle single result', () => {
      render(
        <AutocompleteDropdown
          {...defaultProps}
          results={[{ word: 'single' }]}
        />
      );

      expect(screen.getByText('single')).toBeInTheDocument();
    });

    it('should handle results with missing word property', () => {
      const resultsWithMissing: Word[] = [
        { word: 'apple' },
        { frequency: 50 },
        { word: 'apply' },
      ];

      render(
        <AutocompleteDropdown
          {...defaultProps}
          results={resultsWithMissing}
        />
      );

      expect(screen.getByText('apple')).toBeInTheDocument();
      expect(screen.getByText('apply')).toBeInTheDocument();
    });
  });
});
