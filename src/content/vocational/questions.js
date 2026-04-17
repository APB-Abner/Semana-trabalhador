export const vocationalQuestions = [
  {
    id: 'voc-1',
    texto: 'Em um trabalho em grupo, qual papel costuma combinar mais com você?',
    contexto: 'Pense no tipo de contribuição que te dá energia quando há um objetivo em comum.',
    opcoes: [
      {
        id: 'voc-1-a',
        texto: '📅 Organizar o cronograma e dividir as tarefas com clareza',
        weights: { organizacional: 3, lideranca: 2 },
      },
      {
        id: 'voc-1-b',
        texto: '🤝 Escutar o grupo e manter a equipe alinhada',
        weights: { social: 3, lideranca: 1 },
      },
      {
        id: 'voc-1-c',
        texto: '🎨 Pensar no conceito, no visual ou em uma solução original',
        weights: { criativo: 3, social: 1 },
      },
      {
        id: 'voc-1-d',
        texto: '🧪 Testar o que funciona e corrigir o que sair errado',
        weights: { analitico: 2, pratico: 2 },
      },
    ],
  },
  {
    id: 'voc-2',
    texto: 'Quando precisa aprender uma ferramenta nova, você prefere:',
    contexto: 'Considere a forma mais natural de começar a aprender sem se travar.',
    opcoes: [
      {
        id: 'voc-2-a',
        texto: '🧠 Explorar menus, hipóteses e padrões até entender a lógica',
        weights: { analitico: 3, pratico: 1 },
      },
      {
        id: 'voc-2-b',
        texto: '📝 Pedir uma demonstração e anotar um passo a passo',
        weights: { organizacional: 2, pratico: 1, social: 1 },
      },
      {
        id: 'voc-2-c',
        texto: '🎬 Ver exemplos, adaptar ideias e experimentar um jeito próprio',
        weights: { criativo: 2, pratico: 1, analitico: 1 },
      },
      {
        id: 'voc-2-d',
        texto: '💬 Entender primeiro como aquilo ajuda pessoas ou equipes',
        weights: { social: 2, lideranca: 1, organizacional: 1 },
      },
    ],
  },
  {
    id: 'voc-3',
    texto: 'Qual rotina tende a te deixar mais satisfeito no trabalho?',
    contexto: 'Não pense no que parece “melhor”, mas no ambiente em que você rende com menos desgaste.',
    opcoes: [
      {
        id: 'voc-3-a',
        texto: '📊 Uma rotina previsível, com prioridades e processos bem definidos',
        weights: { organizacional: 3, analitico: 1 },
      },
      {
        id: 'voc-3-b',
        texto: '🚀 Uma rotina dinâmica, com problemas novos para resolver',
        weights: { pratico: 2, analitico: 2 },
      },
      {
        id: 'voc-3-c',
        texto: '🎯 Uma rotina com espaço para criar, adaptar e propor ideias',
        weights: { criativo: 3, lideranca: 1 },
      },
      {
        id: 'voc-3-d',
        texto: '🗣️ Uma rotina com interação frequente, apoio e orientação a pessoas',
        weights: { social: 3, lideranca: 1 },
      },
    ],
  },
  {
    id: 'voc-4',
    texto: 'Qual dessas conquistas te parece mais recompensadora?',
    contexto: 'Escolha o tipo de resultado que mais te dá sensação de avanço real.',
    opcoes: [
      {
        id: 'voc-4-a',
        texto: '📈 Melhorar um processo e fazer tudo funcionar com mais eficiência',
        weights: { organizacional: 2, analitico: 2 },
      },
      {
        id: 'voc-4-b',
        texto: '💡 Encontrar uma solução elegante para um problema complicado',
        weights: { analitico: 3, criativo: 1 },
      },
      {
        id: 'voc-4-c',
        texto: '❤️ Perceber que seu trabalho ajudou diretamente alguém',
        weights: { social: 3, pratico: 1 },
      },
      {
        id: 'voc-4-d',
        texto: '🌟 Transformar uma ideia em algo marcante, visual ou memorável',
        weights: { criativo: 3, lideranca: 1 },
      },
    ],
  },
  {
    id: 'voc-5',
    texto: 'Se surgisse um problema urgente no meio do dia, você tenderia a:',
    contexto: 'Pense na sua primeira reação natural, não na resposta “mais bonita”.',
    opcoes: [
      {
        id: 'voc-5-a',
        texto: '🔎 Levantar dados, identificar causa e testar possibilidades',
        weights: { analitico: 3, pratico: 1 },
      },
      {
        id: 'voc-5-b',
        texto: '🧰 Ir logo para a execução e ajustar no caminho',
        weights: { pratico: 3, lideranca: 1 },
      },
      {
        id: 'voc-5-c',
        texto: '📣 Reorganizar o time e redistribuir prioridades',
        weights: { lideranca: 2, organizacional: 2 },
      },
      {
        id: 'voc-5-d',
        texto: '🤗 Entender quem foi impactado e aliviar a tensão antes de seguir',
        weights: { social: 3, lideranca: 1 },
      },
    ],
  },
  {
    id: 'voc-6',
    texto: 'Qual dessas atividades você escolheria em uma trilha extra?',
    contexto: 'Imagine que você pode explorar uma oficina prática por algumas semanas.',
    opcoes: [
      {
        id: 'voc-6-a',
        texto: '🧮 Análise de dados, finanças ou raciocínio lógico',
        weights: { analitico: 3, organizacional: 1 },
      },
      {
        id: 'voc-6-b',
        texto: '🎤 Comunicação, apresentação e mediação de conversas',
        weights: { social: 2, lideranca: 2 },
      },
      {
        id: 'voc-6-c',
        texto: '🖌️ Design, conteúdo, edição ou criação visual',
        weights: { criativo: 3, pratico: 1 },
      },
      {
        id: 'voc-6-d',
        texto: '🛠️ Ferramentas, montagem, operação ou suporte técnico',
        weights: { pratico: 3, analitico: 1 },
      },
    ],
  },
  {
    id: 'voc-7',
    texto: 'Em um ambiente profissional, você costuma contribuir mais quando pode:',
    contexto: 'Pense no tipo de contribuição que as pessoas mais reconhecem em você.',
    opcoes: [
      {
        id: 'voc-7-a',
        texto: '🗂️ Dar estrutura, organizar materiais e acompanhar prazos',
        weights: { organizacional: 3, lideranca: 1 },
      },
      {
        id: 'voc-7-b',
        texto: '🫱🏽‍🫲🏾 Receber pessoas, orientar e construir confiança',
        weights: { social: 3, lideranca: 1 },
      },
      {
        id: 'voc-7-c',
        texto: '⚙️ Ajustar detalhes, testar processos e melhorar execução',
        weights: { pratico: 2, analitico: 2 },
      },
      {
        id: 'voc-7-d',
        texto: '✨ Dar forma a ideias, campanhas, textos ou experiências',
        weights: { criativo: 3, social: 1 },
      },
    ],
  },
  {
    id: 'voc-8',
    texto: 'Se você fosse liderar um mini projeto, qual pareceria mais natural?',
    contexto: 'Não pense em cargo, mas no tipo de missão que você toparia puxar.',
    opcoes: [
      {
        id: 'voc-8-a',
        texto: '📋 Organizar uma ação com cronograma, checklists e responsáveis',
        weights: { organizacional: 3, lideranca: 2 },
      },
      {
        id: 'voc-8-b',
        texto: '📢 Conduzir uma campanha para engajar e mobilizar pessoas',
        weights: { social: 2, lideranca: 2, criativo: 1 },
      },
      {
        id: 'voc-8-c',
        texto: '🧪 Desenvolver ou testar uma solução técnica para um problema',
        weights: { analitico: 2, pratico: 2 },
      },
      {
        id: 'voc-8-d',
        texto: '🎨 Criar a identidade, a narrativa ou a apresentação do projeto',
        weights: { criativo: 3, lideranca: 1 },
      },
    ],
  },
  {
    id: 'voc-9',
    texto: 'Quando você imagina um bom começo de carreira, o que pesa mais?',
    contexto: 'Escolha o fator que mais te faria sentir que está no caminho certo.',
    opcoes: [
      {
        id: 'voc-9-a',
        texto: '📚 Ter clareza do que aprender e conseguir evoluir com método',
        weights: { organizacional: 2, analitico: 1, pratico: 1 },
      },
      {
        id: 'voc-9-b',
        texto: '👥 Estar em um ambiente acolhedor, com pessoas acessíveis',
        weights: { social: 3, lideranca: 1 },
      },
      {
        id: 'voc-9-c',
        texto: '🧠 Trabalhar com desafios que te façam pensar e construir soluções',
        weights: { analitico: 3, criativo: 1 },
      },
      {
        id: 'voc-9-d',
        texto: '🎯 Ver resultados concretos do que você fez no dia',
        weights: { pratico: 3, organizacional: 1 },
      },
    ],
  },
  {
    id: 'voc-10',
    texto: 'Qual dessas evoluções pessoais parece mais importante para você agora?',
    contexto: 'Pense no que mais abriria portas ou te faria sentir mais preparado.',
    opcoes: [
      {
        id: 'voc-10-a',
        texto: '📌 Ser mais consistente, organizado e confiável na rotina',
        weights: { organizacional: 3, lideranca: 1 },
      },
      {
        id: 'voc-10-b',
        texto: '🗨️ Falar com mais clareza, presença e segurança',
        weights: { social: 2, lideranca: 2 },
      },
      {
        id: 'voc-10-c',
        texto: '💭 Criar ideias melhores e apresentar soluções com identidade',
        weights: { criativo: 3, lideranca: 1 },
      },
      {
        id: 'voc-10-d',
        texto: '🧩 Resolver problemas com mais lógica e autonomia',
        weights: { analitico: 2, pratico: 2 },
      },
    ],
  },
];
