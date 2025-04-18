import { Typography } from "@material-tailwind/react";

export default function Footer() {
    return (
        <footer className="flex w-full flex-row flex-wrap px-2 items-center justify-center gap-y-6 gap-x-12 bg_footer text-gray-400 py-6 text-center">
            <Typography color="blue-gray" className="font-normal">
                &copy; {new Date().getFullYear()} Aprendizes CIEE - Todos os direitos reservados
            </Typography>
            <ul className="flex flex-row w-2/3 items-center justify-center gap-y-3 gap-x-8">
                <li>
                    <Typography
                        as="a"
                        href="/game"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text_truepurple_hover focus:text_truepurple_focus"
                    >
                        Games
                    </Typography>
                </li>
                <li>
                    <Typography
                        as="a"
                        href="/historias"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text_truepurple_hover focus:text_truepurple_focus"
                    >
                        História
                    </Typography>
                </li>
                <li>
                    <Typography
                        as="a"
                        href="/mapa"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text_truepurple_hover focus:text_truepurple_focus"
                    >
                        Mapa
                    </Typography>
                </li>
                <li>
                    <Typography
                        as="a"
                        href="/testes"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text_truepurple_hover focus:text_truepurple_focus"
                    >
                        Teste
                    </Typography>
                </li>
            </ul>
        </footer>
    );
}