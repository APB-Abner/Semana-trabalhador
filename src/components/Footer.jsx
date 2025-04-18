import { Typography } from "@material-tailwind/react";

export default function Footer() {
    return (
        <footer className="flex w-full flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 border-t border-blue-gray-50 bg_footer text-gray-400 py-6 text-center md:justify-between">
            <Typography color="blue-gray" className="font-normal">
                &copy; {new Date().getFullYear()} Aprendizes CIEE - Todos os direitos reservados
            </Typography>
            <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
                <li>
                    <Typography
                        as="a"
                        href="#"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text_truepurple_hover focus:text_truepurple_focus"
                    >
                        About Us
                    </Typography>
                </li>
                <li>
                    <Typography
                        as="a"
                        href="#"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text_truepurple_hover focus:text_truepurple_focus"
                    >
                        License
                    </Typography>
                </li>
                <li>
                    <Typography
                        as="a"
                        href="#"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text_truepurple_hover focus:text_truepurple_focus"
                    >
                        Contribute
                    </Typography>
                </li>
                <li>
                    <Typography
                        as="a"
                        href="#"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text_truepurple_hover focus:text_truepurple_focus"
                    >
                        Contact Us
                    </Typography>
                </li>
            </ul>
        </footer>
    );
}