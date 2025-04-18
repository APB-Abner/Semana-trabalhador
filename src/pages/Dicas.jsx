import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Dicas() {
    useEffect(() => {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const link = navLinks[index];
                if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                    link.classList.add('text-green-600');
                } else {
                    link.classList.remove('text-green-600');
                }
            });
        });
    }, []);

    return (
        <div className="p-6 space-y-10 bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300">
            <h2 className="text-3xl font-bold text-center">Dicas para Iniciar sua Carreira</h2>
            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 text-center">
                Se você está começando sua jornada no mercado de trabalho, aqui estão algumas dicas valiosas para ajudá-lo a dar os primeiros passos com confiança!
            </p>

            {/* Scrollspy Navigation */}
            <div className="sticky top-0 bg-white dark:bg-zinc-800 shadow-md p-4">
                <ul className="space-y-2">
                    <li><Link to="#curriculo" className="nav-link text-lg text-gray-600 dark:text-gray-400">📝 Elabore um Currículo Impecável</Link></li>
                    <li><Link to="#entrevista" className="nav-link text-lg text-gray-600 dark:text-gray-400">💼 Como Se Comportar em uma Entrevista</Link></li>
                    <li><Link to="#desafios" className="nav-link text-lg text-gray-600 dark:text-gray-400">🔧 Lidar com Desafios no Início da Carreira</Link></li>
                    <li><Link to="#networking" className="nav-link text-lg text-gray-600 dark:text-gray-400">🤝 Construa um Bom Networking</Link></li>
                    <li><Link to="#gestao" className="nav-link text-lg text-gray-600 dark:text-gray-400">⏳ Gestão do Tempo</Link></li>
                    <li><Link to="#estresse" className="nav-link text-lg text-gray-600 dark:text-gray-400">😌 Como Lidar com o Estresse</Link></li>
                    <li><Link to="#feedback" className="nav-link text-lg text-gray-600 dark:text-gray-400">🗣️ Fazer Bom Uso de Feedback</Link></li>
                    <li><Link to="#colaborador" className="nav-link text-lg text-gray-600 dark:text-gray-400">🤝 Seja um Bom Colaborador</Link></li>
                    <li><Link to="#atualizacao" className="nav-link text-lg text-gray-600 dark:text-gray-400">📚 Mantenha-se Atualizado</Link></li>
                </ul>
            </div>

            {/* Dica 1: Como elaborar um bom currículo */}
            <section id="curriculo" className="section space-y-6">
                <h3 className="text-2xl font-semibold">📝 Elabore um Currículo Impecável</h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Um bom currículo é seu cartão de visitas! Aqui estão alguns pontos essenciais:
                    <ul className="list-disc pl-5 mt-2">
                        <li><strong>Seja claro e objetivo</strong>: Foque nas suas habilidades e experiências mais relevantes.</li>
                        <li><strong>Use palavras-chave</strong>: Muitos recrutadores utilizam ferramentas automatizadas, então use termos que correspondam à vaga.</li>
                        <li><strong>Adapte seu currículo</strong>: Customize seu currículo para cada vaga, destacando as habilidades mais importantes para aquela posição.</li>
                    </ul>
                    Dica extra: Inclua projetos pessoais, voluntariado ou qualquer experiência que mostre sua proatividade!
                </p>
            </section>

            {/* Dica 2: Como se comportar na entrevista */}
            <section id="entrevista" className="section space-y-6">
                <h3 className="text-2xl font-semibold">💼 Como Se Comportar em uma Entrevista</h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Uma entrevista é sua chance de brilhar! Aqui estão algumas dicas para causar uma boa impressão:
                    <ul className="list-disc pl-5 mt-2">
                        <li><strong>Prepare-se bem</strong>: Pesquise sobre a empresa, sua cultura e os requisitos da vaga.</li>
                        <li><strong>Comunique-se claramente</strong>: Seja honesto, mas também mostre suas habilidades e como pode contribuir para a empresa.</li>
                        <li><strong>Seja pontual</strong>: Chegar no horário é crucial. Isso demonstra respeito e comprometimento.</li>
                    </ul>
                    Dica extra: Prepare perguntas inteligentes sobre a empresa, isso mostra interesse e engajamento!
                </p>
            </section>

            {/* Dica 3: Como lidar com desafios iniciais */}
            <section id="desafios" className="section space-y-6">
                <h3 className="text-2xl font-semibold">🔧 Lidar com Desafios no Início da Carreira</h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Todo começo é desafiador. Aqui estão algumas dicas para superar obstáculos comuns:
                    <ul className="list-disc pl-5 mt-2">
                        <li><strong>Seja paciente</strong>: O começo da carreira pode ser difícil, mas com tempo você vai adquirir mais confiança e habilidades.</li>
                        <li><strong>Aprenda com os erros</strong>: Todos cometem erros, o importante é aprender com eles e não desanimar.</li>
                        <li><strong>Seja aberto ao feedback</strong>: Receber críticas construtivas é essencial para o seu crescimento profissional.</li>
                    </ul>
                    Dica extra: Cultive a resiliência e não tenha medo de pedir ajuda quando necessário.
                </p>
            </section>

            {/* Dica 4: Networking e relações profissionais */}
            <section id="networking" className="section space-y-6">
                <h3 className="text-2xl font-semibold">🤝 Construa um Bom Networking</h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Ter uma boa rede de contatos pode ser decisivo para sua carreira. Aqui estão algumas dicas:
                    <ul className="list-disc pl-5 mt-2">
                        <li><strong>Participe de eventos e palestras</strong>: Além de aprender, você pode conhecer pessoas da sua área.</li>
                        <li><strong>Seja genuíno</strong>: Relacionamentos profissionais são construídos com base na confiança e autenticidade.</li>
                        <li><strong>Use as redes sociais a seu favor</strong>: LinkedIn é uma excelente ferramenta para construir sua rede de contatos.</li>
                    </ul>
                    Dica extra: Nunca subestime o poder de um bom primeiro contato! O networking começa com uma boa impressão.
                </p>
            </section>

            {/* Dica 5: Gestão do Tempo */}
            <section id="gestao" className="section space-y-6">
                <h3 className="text-2xl font-semibold">⏳ Gestão do Tempo</h3>
                <p className="text-gray-600 dark:text-gray-400">
                    A gestão do tempo é fundamental para manter sua produtividade e evitar o estresse. Aqui estão algumas dicas:
                    <ul className="list-disc pl-5 mt-2">
                        <li><strong>Estabeleça prioridades</strong>: Identifique tarefas urgentes e importantes e organize sua agenda de acordo.</li>
                        <li><strong>Use ferramentas de produtividade</strong>: Aplicativos como o Trello, Google Calendar e Notion podem ajudá-lo a organizar suas atividades.</li>
                        <li><strong>Evite multitarefa</strong>: Focar em uma tarefa de cada vez aumenta a qualidade do seu trabalho e a eficiência.</li>
                    </ul>
                    Dica extra: Faça pausas regulares para manter o foco e a energia ao longo do dia.
                </p>
            </section>

            {/* Dica 6: Como lidar com o estresse */}
            <section id="estresse" className="section space-y-6">
                <h3 className="text-2xl font-semibold">😌 Como Lidar com o Estresse</h3>
                <p className="text-gray-600 dark:text-gray-400">
                    O estresse é comum no começo da carreira, mas com as estratégias certas você pode controlá-lo:
                    <ul className="list-disc pl-5 mt-2">
                        <li><strong>Pratique exercícios físicos</strong>: A atividade física ajuda a liberar a tensão e melhora o humor.</li>
                        <li><strong>Respire profundamente</strong>: Técnicas de respiração ajudam a acalmar e reduzir a ansiedade.</li>
                        <li><strong>Organize sua carga de trabalho</strong>: Evite se sobrecarregar e aprenda a delegar tarefas quando necessário.</li>
                    </ul>
                    Dica extra: Encontre hobbies ou atividades que ajudem a relaxar e equilibrar o seu dia a dia.
                </p>
            </section>

            {/* Dica 7: Fazer bom uso de feedback */}
            <section id="feedback" className="section space-y-6">
                <h3 className="text-2xl font-semibold">🗣️ Fazer Bom Uso de Feedback</h3>
                <p className="text-gray-600 dark:text-gray-400">
                    O feedback é uma ferramenta poderosa para o seu crescimento profissional. Aqui vão algumas dicas:
                    <ul className="list-disc pl-5 mt-2">
                        <li><strong>Seja receptivo</strong>: Não leve para o lado pessoal, encare o feedback como uma oportunidade de aprendizado.</li>
                        <li><strong>Solicite feedback regularmente</strong>: Isso demonstra seu interesse em melhorar e crescer profissionalmente.</li>
                        <li><strong>Faça um plano de ação</strong>: Após receber o feedback, crie um plano para implementar as melhorias sugeridas.</li>
                    </ul>
                </p>
            </section>

            {/* Dica 8: Ser um bom colaborador */}
            <section id="colaborador" className="section space-y-6">
                <h3 className="text-2xl font-semibold">🤝 Seja um Bom Colaborador</h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Ser um bom colaborador é essencial para o seu sucesso profissional. Algumas dicas:
                    <ul className="list-disc pl-5 mt-2">
                        <li><strong>Seja proativo</strong>: Tome iniciativa, esteja sempre disposto a ajudar os colegas e a contribuir com ideias.</li>
                        <li><strong>Comunique-se de forma eficaz</strong>: Uma comunicação clara evita mal-entendidos e facilita a colaboração.</li>
                        <li><strong>Respeite as diferenças</strong>: Cada pessoa tem um jeito de trabalhar, e respeitar isso cria um ambiente de trabalho mais saudável.</li>
                    </ul>
                </p>
            </section>

            {/* Dica 9: Manter-se Atualizado */}
            <section id="atualizacao" className="section space-y-6">
                <h3 className="text-2xl font-semibold">📚 Mantenha-se Atualizado</h3>
                <p className="text-gray-600 dark:text-gray-400">
                    A atualização constante é essencial para se manter competitivo no mercado de trabalho:
                    <ul className="list-disc pl-5 mt-2">
                        <li><strong>Estude novas tendências</strong>: Acompanhe cursos, webinars e eventos relacionados à sua área de atuação.</li>
                        <li><strong>Desenvolva novas habilidades</strong>: Invista em aprender novas ferramentas ou aprimorar suas competências.</li>
                        <li><strong>Leia artigos e livros</strong>: Manter-se bem informado ajudará a tomar melhores decisões e ser mais eficiente.</li>
                    </ul>
                </p>
            </section>

            {/* Conclusão */}
            <section className="mt-10">
                <h3 className="text-2xl font-semibold text-center">🚀 Agora É Sua Vez!</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-4 text-center">
                    Lembre-se, o início de carreira é uma jornada cheia de aprendizado. Mantenha-se motivado, não tenha medo de cometer erros e, acima de tudo, seja proativo!
                    O mercado de trabalho pode ser desafiador, mas com a atitude certa, você conquistará seu espaço.
                </p>
                <div className="text-center mt-6">
                    <Link
                        to="/"
                        className="inline-block px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                        Voltar à Página Principal
                    </Link>
                </div>
            </section>
        </div>
    );
}
