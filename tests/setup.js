import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.history for navigation tests
const mockHistory = {
  pushState: vi.fn(),
  replaceState: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  length: 1,
  state: null,
};

Object.defineProperty(window, 'history', {
  value: mockHistory,
  writable: true,
});

// Mock window.location
delete window.location;
window.location = {
  pathname: '/',
  search: '',
  hash: '',
  origin: 'http://localhost:3000',
  href: 'http://localhost:3000/',
};
