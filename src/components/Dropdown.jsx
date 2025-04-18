import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { SunIcon, MoonIcon } from '@heroicons/react/20/solid'

export default function Dropdown() {
    return (
        <div className='flex items-center justify-center h-screen'>

            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <MenuButton className="group inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            className="size-5 text-gray-400 transition-all duration-300 group-hover:scale-110"
                        >
                            {/* ☀️ Sun (fundo, some no hover) */}
                            <path
                                className="transition-opacity duration-300 opacity-100 group-hover:opacity-100"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 3v1.5M12 19.5V21M4.22 4.22l1.06 1.06M17.72 17.72l1.06 1.06M3 12h1.5M19.5 12H21M4.22 19.78l1.06-1.06M17.72 6.28l1.06-1.06M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
                            />

                            {/* 🌙 Moon (frente, levemente maior no hover) */}
                            <path
                                className="transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:scale-[1.15] origin-center"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                            />
                        </svg>
                    </MenuButton>

                </div>

                <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                    <div className="py-1">
                        <MenuItem>
                            <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                            >
                                <SunIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                            </a>
                        </MenuItem>
                        <MenuItem>
                            <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                            >
                                <MoonIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />

                            </a>
                        </MenuItem>
                     
                        
                    </div>
                </MenuItems>
            </Menu>
        </div>
    )
}


