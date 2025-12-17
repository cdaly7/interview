import { renderHook, act } from '@testing-library/react';
import { useAutocompleteNavigation } from '@/hooks/useAutocompleteNavigation';
import { Word } from '@/hooks/useAutocomplete';

describe('useAutocompleteNavigation', () => {
  const mockResults: Word[] = [
    { word: 'apple' },
    { word: 'application' },
    { word: 'apply' },
  ];

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() =>
        useAutocompleteNavigation([])
      );

      expect(result.current.selectedIndex).toBe(-1);
      expect(result.current.isOpen).toBe(false);
      expect(result.current.containerRef).toBeDefined();
    });
  });

  describe('Selected Index', () => {
    it('should update selected index', () => {
      const { result } = renderHook(() =>
        useAutocompleteNavigation(mockResults)
      );

      act(() => {
        result.current.setSelectedIndex(0);
      });

      expect(result.current.selectedIndex).toBe(0);
    });

    it('should reset selected index when results change', () => {
      const { result, rerender } = renderHook(
        ({ results }) => useAutocompleteNavigation(results),
        { initialProps: { results: mockResults } }
      );

      act(() => {
        result.current.setSelectedIndex(1);
      });

      expect(result.current.selectedIndex).toBe(1);

      rerender({ results: [{ word: 'new' }] });

      expect(result.current.selectedIndex).toBe(-1);
    });
  });

  describe('Open/Close State', () => {
    it('should toggle open state', () => {
      const { result } = renderHook(() =>
        useAutocompleteNavigation(mockResults)
      );

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.setIsOpen(true);
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.setIsOpen(false);
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle ArrowDown to move selection down', () => {
      const { result } = renderHook(() =>
        useAutocompleteNavigation(mockResults)
      );

      const mockSelect = jest.fn();

      act(() => {
        result.current.setIsOpen(true);
      });

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      const mockEvent = {
        ...event,
        key: 'ArrowDown',
        preventDefault: jest.fn(),
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent, mockSelect);
      });

      expect(result.current.selectedIndex).toBe(0);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should handle ArrowUp to move selection up', () => {
      const { result } = renderHook(() =>
        useAutocompleteNavigation(mockResults)
      );

      const mockSelect = jest.fn();

      act(() => {
        result.current.setIsOpen(true);
        result.current.setSelectedIndex(2);
      });

      const mockEvent = {
        key: 'ArrowUp',
        preventDefault: jest.fn(),
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent, mockSelect);
      });

      expect(result.current.selectedIndex).toBe(1);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should handle Enter to select item', () => {
      const { result } = renderHook(() =>
        useAutocompleteNavigation(mockResults)
      );

      const mockSelect = jest.fn();

      act(() => {
        result.current.setIsOpen(true);
        result.current.setSelectedIndex(1);
      });

      const mockEvent = {
        key: 'Enter',
        preventDefault: jest.fn(),
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent, mockSelect);
      });

      expect(mockSelect).toHaveBeenCalledWith(mockResults[1]);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should handle Escape to close dropdown', () => {
      const { result } = renderHook(() =>
        useAutocompleteNavigation(mockResults)
      );

      const mockSelect = jest.fn();

      act(() => {
        result.current.setIsOpen(true);
        result.current.setSelectedIndex(1);
      });

      const mockEvent = {
        key: 'Escape',
        preventDefault: jest.fn(),
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent, mockSelect);
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.selectedIndex).toBe(-1);
    });

    it('should not navigate when dropdown is closed', () => {
      const { result } = renderHook(() =>
        useAutocompleteNavigation(mockResults)
      );

      const mockSelect = jest.fn();

      const mockEvent = {
        key: 'ArrowDown',
        preventDefault: jest.fn(),
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent, mockSelect);
      });

      expect(result.current.selectedIndex).toBe(-1);
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should not navigate when results are empty', () => {
      const { result } = renderHook(() =>
        useAutocompleteNavigation([])
      );

      const mockSelect = jest.fn();

      act(() => {
        result.current.setIsOpen(true);
      });

      const mockEvent = {
        key: 'ArrowDown',
        preventDefault: jest.fn(),
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent, mockSelect);
      });

      expect(result.current.selectedIndex).toBe(-1);
    });

    it('should not go beyond last item when pressing ArrowDown', () => {
      const { result } = renderHook(() =>
        useAutocompleteNavigation(mockResults)
      );

      const mockSelect = jest.fn();

      act(() => {
        result.current.setIsOpen(true);
        result.current.setSelectedIndex(2); // Last item
      });

      const mockEvent = {
        key: 'ArrowDown',
        preventDefault: jest.fn(),
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent, mockSelect);
      });

      expect(result.current.selectedIndex).toBe(2); // Should stay at last
    });

    it('should go to -1 when pressing ArrowUp from first item', () => {
      const { result } = renderHook(() =>
        useAutocompleteNavigation(mockResults)
      );

      const mockSelect = jest.fn();

      act(() => {
        result.current.setIsOpen(true);
        result.current.setSelectedIndex(0);
      });

      const mockEvent = {
        key: 'ArrowUp',
        preventDefault: jest.fn(),
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent, mockSelect);
      });

      expect(result.current.selectedIndex).toBe(-1);
    });
  });

  describe('Container Reference', () => {
    it('should have a valid container ref', () => {
      const { result } = renderHook(() =>
        useAutocompleteNavigation(mockResults)
      );

      expect(result.current.containerRef).toBeDefined();
      expect(result.current.containerRef.current).toBeNull();
    });
  });

  describe('Click Outside Detection', () => {
    it('should close dropdown when clicking outside', () => {
      const { result } = renderHook(() =>
        useAutocompleteNavigation(mockResults)
      );

      const div = document.createElement('div');
      (result.current.containerRef as any).current = div;

      act(() => {
        result.current.setIsOpen(true);
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        const event = new MouseEvent('mousedown', { bubbles: true });
        document.dispatchEvent(event);
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should not close dropdown when clicking inside', () => {
      const { result } = renderHook(() =>
        useAutocompleteNavigation(mockResults)
      );

      const div = document.createElement('div');
      const button = document.createElement('button');
      div.appendChild(button);
      document.body.appendChild(div);
      (result.current.containerRef as any).current = div;

      act(() => {
        result.current.setIsOpen(true);
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        const event = new MouseEvent('mousedown', { bubbles: true });
        button.dispatchEvent(event);
      });

      expect(result.current.isOpen).toBe(true);

      document.body.removeChild(div);
    });
  });
});
