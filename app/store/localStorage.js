const storageKey = 'loginstate';

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(storageKey);
    if (serializedState === null) {
      return undefined;
    }
    const store = JSON.parse(serializedState);
    delete store.router;
    return store;
  } catch (err) {
    return undefined;
  }
};

export const unloadState = () => {
  localStorage.removeItem(storageKey);
};

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(storageKey, serializedState);
  } catch (err) {
    // TODO: ivan.santos - report error to sentry
  }
};
