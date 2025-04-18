import { useState, useLayoutEffect, useEffect } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'

export default function DarkModeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false)

    useLayoutEffect(() => {
        const savedPref = localStorage.getItem("darkMode")
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        const initialMode = savedPref !== null ? savedPref === "true" : prefersDark
        setIsDarkMode(initialMode)
        document.documentElement.classList.toggle("dark", initialMode)
    }, [])

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode)
        localStorage.setItem("darkMode", isDarkMode)
    }, [isDarkMode])

    const toggleDarkMode = () => setIsDarkMode(prev => !prev)

    return (
        <button
            onClick={toggleDarkMode}
            aria-pressed={isDarkMode}
            aria-label="Alternar modo escuro"
            title="Alternar modo escuro"
            className="group relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-truepurple-200 text-gray-300 dark:bg_truepurple-400 dark:text_truepurple-100 transition-all duration-300"
        >
            {/* Ícone atual (fora do hover) */}
            {isDarkMode ? (
                <MoonIcon className="w-6 h-6 transition-all duration-300 opacity-100 group-hover:opacity-0" />
            ) : (
                <SunIcon className="w-6 h-6 transition-all duration-300 opacity-100 group-hover:opacity-0" />
            )}

            {/* Ícones sobrepostos no hover */}
            <div className="absolute inset-0 flex rounded-full bg_truepurple-400 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-600">
                <SunIcon className="w-6 h-6 absolute text-gray-50  dark:text-truepurple-100 transform scale-100 group-hover:rotate-[45deg] transition-transform duration-500 ease-out" />
                <MoonIcon className="w-6 h-6 absolute rotate-0 text-white dark:text-truepurple-100 transform scale-100 group-hover:rotate-[-90deg] transition-transform duration-500 ease-out" />
            </div>
            
        </button>
    )
}
