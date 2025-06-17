import '@testing-library/jest-dom';

vi.mock('react-i18next', async () => {
  const react = await vi.importActual<typeof import('react-i18next')>('react-i18next');
  return {
    ...react,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: { changeLanguage: () => new Promise(() => {}) },
    }),
  };
});

class IntersectionObserverMock {
  constructor(_callback: any, _options?: any) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
