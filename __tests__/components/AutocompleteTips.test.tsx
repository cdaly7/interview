import { render, screen } from '@testing-library/react';
import { AutocompleteTips } from '@/components/AutocompleteTips';

describe('AutocompleteTips', () => {
  describe('Rendering', () => {
    it('should render the tips section', () => {
      render(<AutocompleteTips />);

      expect(screen.getByText('💡 Tips:')).toBeInTheDocument();
    });

    it('should render all tips', () => {
      render(<AutocompleteTips />);

      expect(screen.getByText(/Use arrow keys to navigate results/)).toBeInTheDocument();
      expect(screen.getByText(/Press Enter to select a result/)).toBeInTheDocument();
      expect(screen.getByText(/Press Escape to close the dropdown/)).toBeInTheDocument();
      expect(screen.getByText(/Selected items are logged to the console/)).toBeInTheDocument();
    });
  });

  describe('Structure', () => {
    it('should render as unordered list', () => {
      const { container } = render(<AutocompleteTips />);

      const list = container.querySelector('ul');
      expect(list).toBeInTheDocument();
    });

    it('should have correct number of list items', () => {
      const { container } = render(<AutocompleteTips />);

      const listItems = container.querySelectorAll('li');
      expect(listItems.length).toBe(4);
    });
  });

  describe('Styling', () => {
    it('should have correct container classes', () => {
      const { container } = render(<AutocompleteTips />);

      const section = container.firstChild;
      expect(section).toHaveClass('mt-8', 'p-4', 'bg-blue-50', 'border');
    });

    it('should have correct heading classes', () => {
      const { container } = render(<AutocompleteTips />);
      const heading = container.querySelector('p');
      expect(heading).toHaveClass('font-semibold', 'text-blue-900', 'mb-2');
    });

    it('should have correct list classes', () => {
      const { container } = render(<AutocompleteTips />);

      const list = container.querySelector('ul');
      expect(list).toHaveClass('list-disc', 'list-inside', 'space-y-1');
    });

    it('should have correct text color classes', () => {
      const { container } = render(<AutocompleteTips />);

      const list = container.querySelector('ul');
      expect(list).toHaveClass('text-blue-800');
    });
  });

  describe('Content', () => {
    it('should include emoji in heading', () => {
      const { container } = render(<AutocompleteTips />);
      const heading = container.querySelector('p');
      expect(heading?.textContent).toContain('💡');
    });

    it('should mention keyboard shortcuts', () => {
      render(<AutocompleteTips />);

      expect(screen.getByText(/arrow keys/i)).toBeInTheDocument();
      expect(screen.getByText(/Enter/i)).toBeInTheDocument();
      expect(screen.getByText(/Escape/i)).toBeInTheDocument();
    });

    it('should mention console logging', () => {
      render(<AutocompleteTips />);

      expect(screen.getByText(/console/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      const { container } = render(<AutocompleteTips />);

      const section = container.querySelector('div');
      expect(section).toBeInTheDocument();
    });

    it('should have proper list markup for screen readers', () => {
      const { container } = render(<AutocompleteTips />);

      const ul = container.querySelector('ul');
      const lis = ul?.querySelectorAll('li');
      expect(lis?.length).toBe(4);
    });
  });
});
