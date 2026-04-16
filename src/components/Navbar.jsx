import { Link, useLocation } from 'react-router-dom';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import DarkModeToggle from '../features/theme-toggle/ui/DarkModeToggle.jsx';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Mapa', href: '/mapa' },
    { name: 'Testes', href: '/testes' },
    { name: 'Game', href: '/game' },
    { name: 'Competição', href: '/competicao' },
    { name: 'Histórias', href: '/historias' },
    { name: 'Dicas', href: '/dicas' },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

function isCurrentPath(currentPath, href) {
    return href === '/' ? currentPath === href : currentPath.startsWith(href);
}

export default function Navbar() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <Disclosure as="nav" data-app-nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                        <DisclosureButton className="group inline-flex items-center justify-center rounded p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-gray-300 dark:hover:bg-zinc-800 dark:hover:text-white sm:hidden">
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-open:block" />
                        </DisclosureButton>

                        <Link to="/" className="flex min-w-0 items-center gap-3">
                            <img alt="CIEE" src="/ciee.jpg" className="h-9 w-auto rounded bg-white" />
                            <span className="hidden text-sm font-extrabold leading-tight text-gray-950 dark:text-white md:block">
                                Semana do Jovem Trabalhador
                            </span>
                        </Link>
                    </div>

                    <div className="hidden flex-1 justify-center sm:flex">
                        <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
                            {navigation.map((item) => {
                                const isCurrent = isCurrentPath(currentPath, item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        aria-current={isCurrent ? 'page' : undefined}
                                        className={classNames(
                                            isCurrent
                                                ? 'bg-white text-blue-700 shadow-sm dark:bg-zinc-800 dark:text-blue-200'
                                                : 'text-gray-600 hover:text-gray-950 dark:text-gray-300 dark:hover:text-white',
                                            'rounded-full px-3 py-2 text-sm font-semibold transition'
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <DarkModeToggle />
                </div>
            </div>

            <DisclosurePanel className="border-t border-gray-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950 sm:hidden">
                <div className="space-y-1">
                    {navigation.map((item) => {
                        const isCurrent = isCurrentPath(currentPath, item.href);
                        return (
                            <DisclosureButton
                                key={item.name}
                                as={Link}
                                to={item.href}
                                aria-current={isCurrent ? 'page' : undefined}
                                className={classNames(
                                    isCurrent
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-800',
                                    'block rounded px-3 py-2 text-base font-semibold transition'
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
