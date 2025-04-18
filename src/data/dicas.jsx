const dicas = [
    {
        id: 'curriculo',
        title: 'Elabore um Currículo Impecável',
        icon: '📝',
        content: (
            <ul className="list-disc pl-5 mt-2">
                <li><strong>Seja objetivo</strong>: Mantenha as informações claras e diretas.</li>
                <li><strong>Destaque suas experiências</strong>: Mesmo que sejam voluntárias ou escolares.</li>
                <li><strong>Atualize sempre</strong>: Mantenha o currículo sempre atualizado com novas conquistas e experiências.</li>
            </ul>
        ),
    },
    {
        id: 'entrevista',
        title: 'Como Se Comportar em uma Entrevista',
        icon: '💼',
        content: (
            <ul className="list-disc pl-5 mt-2">
                <li><strong>Vista-se adequadamente</strong>: Nem sempre precisa ser formal, mas deve demonstrar respeito.</li>
                <li><strong>Seja pontual</strong>: Chegue com pelo menos 10 minutos de antecedência.</li>
                <li><strong>Mostre interesse</strong>: Pesquise sobre a empresa e faça perguntas pertinentes.</li>
            </ul>
        ),
    },
    {
        id: 'desafios',
        title: 'Lidar com Desafios no Início da Carreira',
        icon: '🔧',
        content: (
            <ul className="list-disc pl-5 mt-2">
                <li><strong>Aprenda com os erros</strong>: Errar faz parte do crescimento.</li>
                <li><strong>Tenha resiliência</strong>: A adaptação ao ambiente de trabalho leva tempo.</li>
                <li><strong>Busque apoio</strong>: Converse com colegas e mentores.</li>
            </ul>
        ),
    },
    {
        id: 'networking',
        title: 'Construa um Bom Networking',
        icon: '🤝',
        content: (
            <ul className="list-disc pl-5 mt-2">
                <li><strong>Participe de eventos</strong>: Feiras, palestras e encontros da área.</li>
                <li><strong>Mantenha contato</strong>: Cultive as conexões que fizer.</li>
                <li><strong>Compartilhe conhecimento</strong>: Networking também é troca!</li>
            </ul>
        ),
    },
    {
        id: 'gestao',
        title: 'Gestão do Tempo',
        icon: '⏳',
        content: (
            <ul className="list-disc pl-5 mt-2">
                <li><strong>Crie uma rotina</strong>: Organize seu dia com horários definidos.</li>
                <li><strong>Evite procrastinação</strong>: Use técnicas como Pomodoro ou listas de tarefas.</li>
                <li><strong>Separe tempo para descansar</strong>: Pausas são essenciais.</li>
            </ul>
        ),
    },
    {
        id: 'estresse',
        title: 'Como Lidar com o Estresse',
        icon: '😌',
        content: (
            <ul className="list-disc pl-5 mt-2">
                <li><strong>Respire fundo</strong>: Técnicas de respiração ajudam a acalmar.</li>
                <li><strong>Tenha hobbies</strong>: Música, esporte, arte… algo fora do trabalho.</li>
                <li><strong>Busque ajuda se necessário</strong>: Conversar com um psicólogo pode ser importante.</li>
            </ul>
        ),
    },
    {
        id: 'feedback',
        title: 'Fazer Bom Uso de Feedback',
        icon: '🗣️',
        content: (
            <ul className="list-disc pl-5 mt-2">
                <li><strong>Ouça com atenção</strong>: Não leve para o lado pessoal.</li>
                <li><strong>Coloque em prática</strong>: Use o feedback como guia de melhoria.</li>
                <li><strong>Peça retorno</strong>: Mostra interesse em evoluir.</li>
            </ul>
        ),
    },
    {
        id: 'colaborador',
        title: 'Seja um Bom Colaborador',
        icon: '🤝',
        content: (
            <ul className="list-disc pl-5 mt-2">
                <li><strong>Seja proativo</strong>: Tome iniciativa, ajude os colegas e traga ideias.</li>
                <li><strong>Comunique-se bem</strong>: Clareza evita conflitos.</li>
                <li><strong>Respeite as diferenças</strong>: Trabalho em equipe exige empatia.</li>
            </ul>
        ),
    },
    {
        id: 'atualizacao',
        title: 'Mantenha-se Atualizado',
        icon: '📚',
        content: (
            <ul className="list-disc pl-5 mt-2">
                <li><strong>Estude tendências</strong>: Participe de cursos, webinars e eventos.</li>
                <li><strong>Aprenda novas ferramentas</strong>: Softwares, idiomas ou novas tecnologias.</li>
                <li><strong>Leia conteúdos da área</strong>: Artigos, livros e revistas especializadas.</li>
            </ul>
        ),
    }
];

export default dicas;
