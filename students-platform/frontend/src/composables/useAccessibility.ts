import { onMounted, onUnmounted } from 'vue';

/**
 * Composable for accessibility features
 */
export const useAccessibility = () => {
  // Focus trap for modals
  const trapFocus = (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }

      if (e.key === 'Escape') {
        element.dispatchEvent(new CustomEvent('escape'));
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  };

  // Announce to screen readers
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const liveRegion = document.querySelector(`[aria-live="${priority}"]`) || createLiveRegion(priority);
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  };

  const createLiveRegion = (priority: 'polite' | 'assertive') => {
    const region = document.createElement('div');
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(region);
    return region;
  };

  // Keyboard navigation helper
  const useKeyboardNavigation = (handlers: Record<string, () => void>) => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const handler = handlers[e.key];
      if (handler) {
        e.preventDefault();
        handler();
      }
    };

    onMounted(() => {
      document.addEventListener('keydown', handleKeyDown);
    });

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeyDown);
    });
  };

  // Focus management
  const manageFocus = () => {
    let lastFocusedElement: HTMLElement | null = null;

    const saveFocus = () => {
      lastFocusedElement = document.activeElement as HTMLElement;
    };

    const restoreFocus = () => {
      lastFocusedElement?.focus();
    };

    return { saveFocus, restoreFocus };
  };

  // Skip links helper
  const addSkipLink = (targetId: string, label = 'Skip to main content') => {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = label;
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      left: -9999px;
      z-index: 999;
      padding: 1em;
      background-color: #000;
      color: white;
      text-decoration: none;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.left = '0';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.left = '-9999px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  };

  return {
    trapFocus,
    announce,
    useKeyboardNavigation,
    manageFocus,
    addSkipLink,
  };
};
