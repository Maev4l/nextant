import { nanoid } from 'nanoid';

/**
 * Creates a memory-based history abstraction for browser navigation
 * Wraps window.history with internal state tracking
 */
export const createMemoryHistory = () => {
  let index = 0;
  let items = [];

  // Pending callbacks for history.go(n) - may be interrupted
  const pending = [];

  const interrupt = () => {
    // Interrupt existing operations if another history change occurs
    pending.forEach((it) => {
      const cb = it.cb;
      it.cb = () => cb(true);
    });
  };

  const history = {
    get index() {
      // Use ID from state instead of index to handle page reloads
      const id = window.history.state?.id;

      if (id) {
        const idx = items.findIndex((item) => item.id === id);
        return idx > -1 ? idx : 0;
      }

      return 0;
    },

    get(idx) {
      return items[idx];
    },

    backIndex({ path }) {
      // Find closest matching path to go back to
      for (let i = index - 1; i >= 0; i--) {
        if (items[i].path === path) {
          return i;
        }
      }
      return -1;
    },

    push({ path, state }) {
      interrupt();

      const id = nanoid();

      // Remove inaccessible entries after current index
      items = items.slice(0, index + 1);
      items.push({ path, state, id });
      index = items.length - 1;

      // Empty string for title (ignored by all browsers except Safari)
      window.history.pushState({ id }, '', path);
    },

    replace({ path, state }) {
      interrupt();

      const id = window.history.state?.id ?? nanoid();

      // Preserve hash if path doesn't change
      let pathWithHash = path;
      const hash = pathWithHash.includes('#') ? '' : location.hash;

      if (!items.length || items.findIndex((item) => item.id === id) < 0) {
        pathWithHash = pathWithHash + hash;
        items = [{ path: pathWithHash, state, id }];
        index = 0;
      } else {
        if (items[index].path === path) {
          pathWithHash = pathWithHash + hash;
        }
        items[index] = { path, state, id };
      }

      window.history.replaceState({ id }, '', pathWithHash);
    },

    go(n) {
      interrupt();

      // Guard against navigating outside app history
      const nextIndex = index + n;
      const lastItemIndex = items.length - 1;

      if (n < 0 && !items[nextIndex]) {
        n = -index;
        index = 0;
      } else if (n > 0 && nextIndex > lastItemIndex) {
        n = lastItemIndex - index;
        index = lastItemIndex;
      } else {
        index = nextIndex;
      }

      if (n === 0) {
        return;
      }

      return new Promise((resolve, reject) => {
        const done = (interrupted) => {
          clearTimeout(timer);

          if (interrupted) {
            reject(new Error('History was changed during navigation.'));
            return;
          }

          // Chrome bug workaround: reset title to update tab bar
          const { title } = window.document;
          window.document.title = '';
          window.document.title = title;

          resolve();
        };

        pending.push({ ref: done, cb: done });

        // Fallback timeout if popstate doesn't fire (100ms based on Firefox timing)
        const timer = setTimeout(() => {
          const foundIndex = pending.findIndex((it) => it.ref === done);

          if (foundIndex > -1) {
            pending[foundIndex].cb();
            pending.splice(foundIndex, 1);
          }

          index = history.index;
        }, 100);

        const onPopState = () => {
          index = history.index;

          const last = pending.pop();
          window.removeEventListener('popstate', onPopState);
          last?.cb();
        };

        window.addEventListener('popstate', onPopState);
        window.history.go(n);
      });
    },

    listen(listener) {
      const onPopState = () => {
        index = history.index;

        // Skip if triggered by our own go(n) call
        if (pending.length) {
          return;
        }

        listener();
      };

      window.addEventListener('popstate', onPopState);
      return () => window.removeEventListener('popstate', onPopState);
    },
  };

  return history;
};
