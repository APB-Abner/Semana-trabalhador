import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const footerLinks = [
    { label: 'Games', href: '/game' },
    { label: 'Competição', href: '/competicao' },
    { label: 'História', href: '/historias' },
    { label: 'Mapa', href: '/mapa' },
    { label: 'Teste', href: '/testes' },
    { label: 'Dicas', href: '/dicas' },
];

export default function Footer() {
    return (
        <footer className="flex w-full flex-row flex-wrap px-2 items-center justify-center gap-y-6 gap-x-12 bg_footer text-gray-400 py-6 text-center">
            <Typography color="blue-gray" className="font-normal">
                &copy; {new Date().getFullYear()} Aprendizes CIEE - Todos os direitos reservados
            </Typography>
            <ul className="flex flex-row w-2/3 items-center justify-center gap-y-3 gap-x-8">
                {footerLinks.map((item) => (
                    <li key={item.href}>
                        <Typography
                            as={Link}
                            to={item.href}
                            color="blue-gray"
                            className="font-normal transition-colors hover:text_truepurple_hover focus:text_truepurple_focus"
                        >
                            {item.label}
                        </Typography>
                    </li>
                ))}
            </ul>
        </footer>
    );
}
