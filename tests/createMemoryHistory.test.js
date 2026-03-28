import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMemoryHistory } from '../src/createMemoryHistory.js';

describe('createMemoryHistory', () => {
  let originalHistory;
  let historyState;
  let historyGoSpy;
  let pushStateSpy;
  let replaceStateSpy;

  beforeEach(() => {
    // Store original
    originalHistory = window.history;
    historyState = { id: null };

    // Mock window.history
    historyGoSpy = vi.fn();
    pushStateSpy = vi.fn((state) => {
      historyState = state;
    });
    replaceStateSpy = vi.fn((state) => {
      historyState = state;
    });

    Object.defineProperty(window, 'history', {
      value: {
        get state() {
          return historyState;
        },
        go: historyGoSpy,
        pushState: pushStateSpy,
        replaceState: replaceStateSpy,
      },
      writable: true,
      configurable: true,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(window, 'history', {
      value: originalHistory,
      writable: true,
      configurable: true,
    });
  });

  describe('initial state', () => {
    it('starts with index 0', () => {
      const history = createMemoryHistory();
      expect(history.index).toBe(0);
    });

    it('returns undefined for empty items', () => {
      const history = createMemoryHistory();
      expect(history.get(0)).toBeUndefined();
    });
  });

  describe('replace', () => {
    it('replaces current entry', () => {
      const history = createMemoryHistory();
      const state = { routes: [{ name: 'Home' }] };

      history.replace({ path: '/home', state });

      expect(history.index).toBe(0);
      expect(history.get(0)).toMatchObject({ path: '/home', state });
      expect(replaceStateSpy).toHaveBeenCalled();
    });

    it('preserves id when replacing existing entry', () => {
      const history = createMemoryHistory();

      history.replace({ path: '/home', state: { v: 1 } });
      const firstId = history.get(0).id;

      history.replace({ path: '/home-updated', state: { v: 2 } });
      const secondId = history.get(0).id;

      expect(firstId).toBe(secondId);
      expect(history.get(0).path).toBe('/home-updated');
    });

    it('generates new id for first replace', () => {
      const history = createMemoryHistory();

      history.replace({ path: '/home', state: {} });

      expect(history.get(0).id).toBeDefined();
      expect(typeof history.get(0).id).toBe('string');
    });
  });

  describe('push', () => {
    it('adds new entry and increments index', () => {
      const history = createMemoryHistory();

      history.replace({ path: '/home', state: {} });
      expect(history.index).toBe(0);

      history.push({ path: '/details', state: {} });
      expect(history.index).toBe(1);
      expect(history.get(1).path).toBe('/details');
      expect(pushStateSpy).toHaveBeenCalled();
    });

    it('removes entries after current index when pushing', () => {
      const history = createMemoryHistory();

      history.replace({ path: '/one', state: {} });
      history.push({ path: '/two', state: {} });
      history.push({ path: '/three', state: {} });

      expect(history.index).toBe(2);

      // Simulate going back - update historyState to match target
      const targetItem = history.get(1);
      historyState = { id: targetItem.id };
      history.go(-1);
      vi.runAllTimers();

      expect(history.index).toBe(1);

      // Now push new entry - should remove '/three'
      history.push({ path: '/four', state: {} });

      expect(history.index).toBe(2);
      expect(history.get(2).path).toBe('/four');
      expect(history.get(3)).toBeUndefined();
    });

    it('generates unique ids for each entry', () => {
      const history = createMemoryHistory();

      history.replace({ path: '/one', state: {} });
      history.push({ path: '/two', state: {} });
      history.push({ path: '/three', state: {} });

      const ids = [
        history.get(0).id,
        history.get(1).id,
        history.get(2).id,
      ];

      expect(new Set(ids).size).toBe(3);
    });
  });

  describe('go', () => {
    it('navigates back', () => {
      const history = createMemoryHistory();

      history.replace({ path: '/one', state: {} });
      history.push({ path: '/two', state: {} });

      expect(history.index).toBe(1);

      // Simulate browser updating state on go back
      const targetItem = history.get(0);
      historyState = { id: targetItem.id };
      history.go(-1);
      vi.runAllTimers();

      expect(historyGoSpy).toHaveBeenCalledWith(-1);
      expect(history.index).toBe(0);
    });

    it('navigates forward', () => {
      const history = createMemoryHistory();

      history.replace({ path: '/one', state: {} });
      history.push({ path: '/two', state: {} });

      // Go back first
      const backTarget = history.get(0);
      historyState = { id: backTarget.id };
      history.go(-1);
      vi.runAllTimers();

      expect(history.index).toBe(0);

      // Now go forward
      const forwardTarget = history.get(1);
      historyState = { id: forwardTarget.id };
      history.go(1);
      vi.runAllTimers();

      expect(historyGoSpy).toHaveBeenCalledWith(1);
      expect(history.index).toBe(1);
    });

    it('does not navigate beyond start', () => {
      const history = createMemoryHistory();

      history.replace({ path: '/one', state: {} });
      expect(history.index).toBe(0);

      history.go(-1);
      vi.runAllTimers();

      // Should not call window.history.go since there's nowhere to go
      expect(historyGoSpy).not.toHaveBeenCalled();
      expect(history.index).toBe(0);
    });

    it('does not navigate beyond end', () => {
      const history = createMemoryHistory();

      history.replace({ path: '/one', state: {} });
      history.push({ path: '/two', state: {} });

      expect(history.index).toBe(1);

      history.go(10);
      vi.runAllTimers();

      // Should not call window.history.go since we're at the end
      expect(historyGoSpy).not.toHaveBeenCalled();
      expect(history.index).toBe(1);
    });

    it('clamps negative navigation to start', () => {
      const history = createMemoryHistory();

      history.replace({ path: '/one', state: {} });
      history.push({ path: '/two', state: {} });
      history.push({ path: '/three', state: {} });

      expect(history.index).toBe(2);

      // Simulate browser state change to first item
      const targetItem = history.get(0);
      historyState = { id: targetItem.id };
      history.go(-10);
      vi.runAllTimers();

      // Should navigate to start (index 0), clamped from -10 to -2
      expect(historyGoSpy).toHaveBeenCalledWith(-2);
      expect(history.index).toBe(0);
    });

    it('returns a promise', () => {
      const history = createMemoryHistory();

      history.replace({ path: '/one', state: {} });
      history.push({ path: '/two', state: {} });

      const result = history.go(-1);

      expect(result).toBeInstanceOf(Promise);
    });

    it('resolves promise on popstate', async () => {
      const history = createMemoryHistory();

      history.replace({ path: '/one', state: {} });
      history.push({ path: '/two', state: {} });

      const goPromise = history.go(-1);

      // Simulate popstate event
      window.dispatchEvent(new PopStateEvent('popstate'));

      await expect(goPromise).resolves.toBeUndefined();
    });

    it('resolves promise on timeout fallback', async () => {
      const history = createMemoryHistory();

      history.replace({ path: '/one', state: {} });
      history.push({ path: '/two', state: {} });

      const goPromise = history.go(-1);

      // Run timers to trigger fallback
      vi.runAllTimers();

      await expect(goPromise).resolves.toBeUndefined();
    });
  });

  describe('get', () => {
    it('returns entry at index', () => {
      const history = createMemoryHistory();
      const state = { test: 'value' };

      history.replace({ path: '/home', state });

      expect(history.get(0)).toMatchObject({ path: '/home', state });
    });

    it('returns undefined for invalid index', () => {
      const history = createMemoryHistory();

      history.replace({ path: '/home', state: {} });

      expect(history.get(5)).toBeUndefined();
      expect(history.get(-1)).toBeUndefined();
    });
  });

  describe('backIndex', () => {
    it('finds matching path in history', () => {
      const history = createMemoryHistory();

      history.replace({ path: '/one', state: {} });
      history.push({ path: '/two', state: {} });
      history.push({ path: '/three', state: {} });

      expect(history.backIndex({ path: '/one' })).toBe(0);
      expect(history.backIndex({ path: '/two' })).toBe(1);
    });

    it('returns -1 when path not found', () => {
      const history = createMemoryHistory();

      history.replace({ path: '/one', state: {} });
      history.push({ path: '/two', state: {} });

      expect(history.backIndex({ path: '/nonexistent' })).toBe(-1);
    });

    it('finds closest match when duplicates exist', () => {
      const history = createMemoryHistory();

      history.replace({ path: '/home', state: {} });
      history.push({ path: '/details', state: {} });
      history.push({ path: '/home', state: {} });
      history.push({ path: '/profile', state: {} });

      // Should find the most recent /home (index 2), searching backwards from current
      expect(history.backIndex({ path: '/home' })).toBe(2);
    });
  });

  describe('listen', () => {
    it('adds popstate listener', () => {
      const history = createMemoryHistory();
      const listener = vi.fn();
      const addEventSpy = vi.spyOn(window, 'addEventListener');

      history.listen(listener);

      expect(addEventSpy).toHaveBeenCalledWith('popstate', expect.any(Function));
      addEventSpy.mockRestore();
    });

    it('returns unsubscribe function', () => {
      const history = createMemoryHistory();
      const listener = vi.fn();
      const removeEventSpy = vi.spyOn(window, 'removeEventListener');

      const unsubscribe = history.listen(listener);
      unsubscribe();

      expect(removeEventSpy).toHaveBeenCalledWith('popstate', expect.any(Function));
      removeEventSpy.mockRestore();
    });

    it('calls listener on popstate', () => {
      const history = createMemoryHistory();
      const listener = vi.fn();

      history.replace({ path: '/home', state: {} });
      history.listen(listener);

      window.dispatchEvent(new PopStateEvent('popstate'));

      expect(listener).toHaveBeenCalled();
    });

    it('does not call listener during go() navigation', () => {
      const history = createMemoryHistory();
      const listener = vi.fn();

      history.replace({ path: '/one', state: {} });
      history.push({ path: '/two', state: {} });
      history.listen(listener);

      // Start a go() navigation
      history.go(-1);

      // Popstate during go() should not trigger listener
      window.dispatchEvent(new PopStateEvent('popstate'));

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('interrupt', () => {
    it('interrupts pending navigation on push', async () => {
      const history = createMemoryHistory();

      history.replace({ path: '/one', state: {} });
      history.push({ path: '/two', state: {} });

      const goPromise = history.go(-1);

      // Push before popstate fires - should interrupt
      history.push({ path: '/three', state: {} });

      // Trigger the pending callback
      window.dispatchEvent(new PopStateEvent('popstate'));

      await expect(goPromise).rejects.toThrow('History was changed during navigation.');
    });

    it('interrupts pending navigation on replace', async () => {
      const history = createMemoryHistory();

      history.replace({ path: '/one', state: {} });
      history.push({ path: '/two', state: {} });

      const goPromise = history.go(-1);

      // Replace before popstate fires - should interrupt
      history.replace({ path: '/updated', state: {} });

      // Trigger the pending callback
      window.dispatchEvent(new PopStateEvent('popstate'));

      await expect(goPromise).rejects.toThrow('History was changed during navigation.');
    });
  });

  describe('index getter', () => {
    it('returns index based on history state id', () => {
      const history = createMemoryHistory();

      history.replace({ path: '/one', state: {} });
      const id = history.get(0).id;

      // Simulate state matching
      historyState = { id };

      expect(history.index).toBe(0);
    });

    it('returns 0 when id not found', () => {
      const history = createMemoryHistory();

      history.replace({ path: '/one', state: {} });
      historyState = { id: 'nonexistent' };

      expect(history.index).toBe(0);
    });

    it('returns 0 when no state', () => {
      const history = createMemoryHistory();
      historyState = null;

      expect(history.index).toBe(0);
    });
  });
});
