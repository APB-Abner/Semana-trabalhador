import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import DarkModeToggle from '../features/theme-toggle/ui/DarkModeToggle.jsx';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Mapa', href: '/mapa' },
    { name: 'Testes', href: '/testes' },
    { name: 'Game', href: '/game' },
    { name: 'Histórias', href: '/historias' },
    { name: 'Dicas', href: '/dicas' },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <Disclosure as="nav" data-app-nav className="bg_truepurple-200 dark:bg-zinc-900">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    {/* Menu button for mobile */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg_truepurple-100 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>

                    {/* Logo */}
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <img
                                alt="CIEE"
                                src="/ciee.jpg"
                                className="h-8 w-auto"
                            />
                        </div>

                        {/* Desktop menu */}
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigation.map((item) => {
                                    const isCurrent = currentPath === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            aria-current={isCurrent ? 'page' : undefined}
                                            className={classNames(
                                                isCurrent
                                                    ? 'bg_truepurple-400 text-white'
                                                    : 'text-gray-300 hover:bg_truepurple-100 hover:text-white',
                                                'rounded-md px-3 py-2 text-sm font-medium'
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Dark Mode Toggle */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <DarkModeToggle />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => {
                        const isCurrent = currentPath === item.href;
                        return (
                            <DisclosureButton
                                key={item.name}
                                as={Link}
                                to={item.href}
                                aria-current={isCurrent ? 'page' : undefined}
                                className={classNames(
                                    isCurrent
                                        ? 'bg_truepurple-400 text-white'
                                        : 'text-gray-300 hover:bg_truepurple-100 hover:text-white',
                                    'block rounded-md px-3 py-2 text-base font-medium'
                                )}
                            >
                                {item.name}
                            </DisclosureButton>
                        );
                    })}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}
