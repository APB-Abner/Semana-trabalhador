import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ThemeContext } from '../../features/theme-toggle/model/theme-context.js';
import {
  applyThemePreference,
  persistThemePreference,
  resolveInitialTheme,
} from '../../features/theme-toggle/model/theme-storage.js';

export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(resolveInitialTheme);

  useLayoutEffect(() => {
    applyThemePreference(theme);
  }, [theme]);

  useEffect(() => {
    persistThemePreference(theme);
  }, [theme]);

  const setTheme = useCallback((nextTheme) => {
    setThemeState(nextTheme === 'dark' ? 'dark' : 'light');
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDarkMode: theme === 'dark',
      setTheme,
      toggleTheme,
    }),
    [setTheme, theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
