import { useState, useEffect } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'

export default function DarkModeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        const darkPref = localStorage.getItem("darkMode") === "true"
        setIsDarkMode(darkPref)
    }, [])

    useEffect(() => {
        document.body.classList.toggle("dark", isDarkMode)
        localStorage.setItem("darkMode", isDarkMode)
    }, [isDarkMode])

    const toggleDarkMode = () => setIsDarkMode(prev => !prev)

    return (
        <div className="flex items-center justify-center h-screen">
            <button
                onClick={toggleDarkMode}
                aria-pressed={isDarkMode}
                aria-label="Alternar modo escuro"
                title="Alternar modo escuro"
                className="group relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-white text-gray-900 shadow-md ring-1 ring-gray-300 hover:ring-gray-400 dark:bg-gray-800 dark:ring-gray-700 dark:text-white transition-all duration-300"
            >
                {/* Ícone atual (fora do hover) */}
                {isDarkMode ? (
                    <MoonIcon className="w-6 h-6 transition-all duration-300 opacity-100 group-hover:opacity-0" />
                ) : (
                    <SunIcon className="w-6 h-6 transition-all duration-300 opacity-100 group-hover:opacity-0" />
                )}

                {/* Ícones sobrepostos no hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-600">
                    {/* Sol girando suavemente */}
                    <SunIcon className="w-6 h-6 absolute text-gray-800 dark:text-white transform scale-100 group-hover:rotate-[45deg] transition-transform duration-500 ease-out" />

                    {/* Lua começando invertida e voltando à posição original */}
                    <MoonIcon className="w-6 h-6 absolute rotate-0 text-gray-800 dark:text-white transform scale-100 group-hover:rotate-[-90deg]  transition-transform duration-500 ease-out" />
                </div>
            </button>
        </div>
    )
}
