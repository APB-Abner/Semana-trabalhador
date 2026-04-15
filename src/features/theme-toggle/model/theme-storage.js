const LEGACY_DARK_MODE_KEY = 'darkMode';
const THEME_KEY = 'theme';

function hasBrowserApis() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function resolveInitialTheme() {
  if (!hasBrowserApis()) {
    return 'light';
  }

  const savedTheme = window.localStorage.getItem(THEME_KEY);
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }

  const legacySavedTheme = window.localStorage.getItem(LEGACY_DARK_MODE_KEY);
  if (legacySavedTheme !== null) {
    return legacySavedTheme === 'true' ? 'dark' : 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyThemePreference(theme) {
  if (!hasBrowserApis()) {
    return;
  }

  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function persistThemePreference(theme) {
  if (!hasBrowserApis()) {
    return;
  }

  window.localStorage.setItem(THEME_KEY, theme);
  window.localStorage.setItem(LEGACY_DARK_MODE_KEY, String(theme === 'dark'));
}
