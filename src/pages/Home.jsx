import { Link } from 'react-router-dom';
import LinhaDoTempo from '../components/LinhaDoTempo';
import Badge from '../shared/ui/Badge.jsx';
import CtaButtonRow from '../shared/ui/CtaButtonRow.jsx';
import PageShell from '../shared/ui/PageShell.jsx';
import ResultPanel from '../shared/ui/ResultPanel.jsx';

const experiences = [
    {
        title: 'Histórias',
        text: 'Entenda marcos, lutas e conquistas que moldaram o trabalho no Brasil.',
        image: '/Contexto.jpg',
        href: '/historias',
        cta: 'Ler histórias',
    },
    {
        title: 'Dicas',
        text: 'Prepare currículo, entrevista e postura profissional com orientações diretas.',
        image: '/Dicas.jpg',
        href: '/dicas',
        cta: 'Ver dicas',
    },
    {
        title: 'Teste vocacional',
        text: 'Descubra áreas que combinam com seu perfil e receba próximos passos.',
        image: '/Teste.jpg',
        href: '/testes',
        cta: 'Fazer teste',
    },
    {
        title: 'Mapa',
        text: 'Encontre unidades e polos de atendimento do CIEE por estado e cidade.',
        image: '/Mapa.jpg',
        href: '/mapa',
        cta: 'Abrir mapa',
    },
];

export default function Home() {
    return (
        <div className="bg-slate-50 text-gray-950 dark:bg-zinc-950 dark:text-white">
            <section className="section relative isolate flex min-h-[calc(100svh-4rem)] items-end overflow-hidden">
                <img
                    src="/Contexto.jpg"
                    alt="Jovens em ambiente profissional"
                    className="absolute inset-0 -z-20 h-full w-full object-cover"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
                <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
                    <div className="max-w-3xl text-white">
                        <Badge tone="green">Semana do Jovem Trabalhador</Badge>
                        <h1 className="font-display mt-5 text-4xl font-extrabold leading-tight sm:text-6xl">
                            Trabalho, escolhas e futuro em uma experiência só.
                        </h1>
                        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
                            Explore direitos, oportunidades, orientação de carreira e desafios interativos para entrar no mundo do trabalho com mais clareza.
                        </p>
                        <CtaButtonRow
                            className="mt-8 justify-start"
                            actions={[
                                { label: 'Começar pelo teste', href: '/testes', tone: 'blue' },
                                { label: 'Ver competição ao vivo', href: '/competicao', tone: 'green' },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <PageShell className="space-y-16">
                <section className="section">
                    <div className="mb-6 max-w-3xl">
                        <Badge tone="blue">Linha do tempo</Badge>
                        <h2 className="font-display mt-3 text-3xl font-extrabold text-gray-950 dark:text-white">
                            Direitos e oportunidades não surgiram por acaso.
                        </h2>
                        <p className="mt-3 text-gray-600 dark:text-gray-300">
                            Acompanhe a evolução dos marcos que explicam o trabalho formal, a aprendizagem profissional e a proteção ao jovem.
                        </p>
                    </div>
                    <LinhaDoTempo />
                </section>

                <section className="section">
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div className="max-w-2xl">
                            <Badge tone="purple">Experiências</Badge>
                            <h2 className="font-display mt-3 text-3xl font-extrabold text-gray-950 dark:text-white">
                                Escolha uma trilha para continuar.
                            </h2>
                        </div>
                        <Link
                            to="/game"
                            className="font-semibold text-blue-700 transition hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
                        >
                            Ir direto para o game
                        </Link>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {experiences.map((experience) => (
                            <Link
                                key={experience.href}
                                to={experience.href}
                                className="group grid overflow-hidden rounded border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800 sm:grid-cols-[11rem_1fr]"
                            >
                                <img
                                    src={experience.image}
                                    alt=""
                                    className="h-44 w-full object-cover sm:h-full"
                                />
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-950 dark:text-white">{experience.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{experience.text}</p>
                                    <p className="mt-4 text-sm font-semibold text-blue-700 group-hover:text-blue-900 dark:text-blue-300">
                                        {experience.cta}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="section">
                    <ResultPanel tone="info" className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-extrabold text-gray-950 dark:text-white">Desafio Jovem Trabalhador</h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-900 dark:text-blue-100">
                                Teste seus conhecimentos no quiz, avance para o jogo da memória e compare seu desempenho no resultado final.
                            </p>
                        </div>
                        <CtaButtonRow
                            actions={[
                                { label: 'Jogar agora', href: '/game', tone: 'purple' },
                            ]}
                        />
                    </ResultPanel>
                </section>
            </PageShell>
        </div>
    );
}
