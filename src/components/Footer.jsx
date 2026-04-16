import { Link } from 'react-router-dom';

const footerLinks = [
    { label: 'Mapa', href: '/mapa' },
    { label: 'Teste', href: '/testes' },
    { label: 'Game', href: '/game' },
    { label: 'Competição', href: '/competicao' },
    { label: 'Histórias', href: '/historias' },
    { label: 'Dicas', href: '/dicas' },
];

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white dark:border-zinc-800 dark:bg-[#070a0f]">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-gray-600 dark:text-gray-300 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <p>
                    &copy; {new Date().getFullYear()} Aprendizes CIEE. Todos os direitos reservados.
                </p>
                <nav aria-label="Rodapé" className="flex flex-wrap gap-x-5 gap-y-2">
                    {footerLinks.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className="font-semibold transition hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:hover:text-blue-300"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </footer>
    );
}
