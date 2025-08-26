// Force demo mode in tests (no real API)
process.env.REACT_APP_API_URL = '';

// Minimal react-router-dom mocks to satisfy tests
jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    __esModule: true,
    useNavigate: () => jest.fn(),
    useParams: () => ({}),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null, key: 'test' }),
    Link: ({ children, to, ...rest }: any) => React.createElement('a', { href: typeof to === 'string' ? to : '#', ...rest }, children),
    Navigate: (_: any) => null,
    Routes: ({ children }: any) => React.createElement(React.Fragment, null, children),
    Route: (_: any) => null,
    BrowserRouter: ({ children }: any) => React.createElement('div', { 'data-testid': 'browser-router' }, children),
    MemoryRouter: ({ children }: any) => React.createElement('div', { 'data-testid': 'memory-router' }, children),
  };
}, { virtual: true });

// JSDOM helpers to avoid NotFoundError on link.remove() and support link.click()
// Ensure anchor click is writable/configurable for tests that stub it
try {
  Object.defineProperty(HTMLAnchorElement.prototype, 'click', {
    configurable: true,
    writable: true,
    value: function () {},
  });
} catch {}
// @ts-ignore
if (!Element.prototype.remove) {
  // @ts-ignore
  Element.prototype.remove = function () {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Increase test timeout to prevent timeout issues
jest.setTimeout(10000);

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn().mockReturnValue(null),
};
global.localStorage = localStorageMock as unknown as Storage;

// Mock fetch globally
global.fetch = jest.fn();

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
  (global.fetch as jest.Mock).mockClear();
});

// Safe auth store reset between tests (if helper is available)
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const authMod = require('./state/auth');
  if (authMod && typeof authMod.__resetAuthStoreForTests === 'function') {
    beforeEach(() => {
      authMod.__resetAuthStoreForTests();
    });
  }
} catch {}

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Ensure document.createElement('a') returns a writable anchor in tests
(() => {
  const originalCreateElement = document.createElement.bind(document);
  document.createElement = ((tagName: string) => {
    if (typeof tagName === 'string' && tagName.toLowerCase() === 'a') {
      const a: any = originalCreateElement('a');
      try {
        Object.defineProperty(a, 'click', { configurable: true, writable: true, value: a.click || (() => {}) });
      } catch { a.click = a.click || (() => {}); }
      try {
        if (!a.remove) a.remove = () => {};
      } catch { a.remove = () => {}; }
      return a as HTMLAnchorElement;
    }
    return originalCreateElement(tagName);
  }) as any;
})();

// Mock jspdf and autotable to avoid ESM/binary issues in Jest
jest.mock('jspdf', () => {
  return {
    __esModule: true,
    default: class jsPDF {
      lastAutoTable: { finalY: number } = { finalY: 35 };
      constructor(_opts?: any) {}
      setFontSize(): void {}
      text(): void {}
      setFillColor(): void {}
      rect(): void {}
      setTextColor(): void {}
      save(): void {}
    },
  };
});

jest.mock('jspdf-autotable', () => {
  return {
    __esModule: true,
    default: (_doc: any, _opts: any) => {},
  };
});

