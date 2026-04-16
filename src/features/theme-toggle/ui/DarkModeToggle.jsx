import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import useTheme from '../model/useTheme.js';

export default function DarkModeToggle({ className = '', ...props }) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDarkMode}
      aria-label="Alternar modo escuro"
      title="Alternar modo escuro"
      className={`group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100 dark:hover:bg-zinc-800 ${className}`}
      {...props}
    >
      {isDarkMode ? (
        <MoonIcon className="h-5 w-5 transition-all duration-300" />
      ) : (
        <SunIcon className="h-5 w-5 transition-all duration-300" />
      )}
    </button>
  );
}
