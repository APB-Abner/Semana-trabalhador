export type MistakeOption = {
  id: string;
  label: string;
  isMistake: boolean;
  explanation: string;
};

export type FindTheMistakeCase = {
  id: string;
  topic: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  contentGroup?: string;
  sessionTags?: string[];
  title: string;
  prompt: string;
  sample: string;
  options: MistakeOption[];
};

export const findTheMistakeCases: FindTheMistakeCase[] = [
  {
    id: 'mistake-email-no-subject',
    topic: 'E-mail',
    title: 'E-mail para o RH',
    prompt: 'Analise a mensagem e marque os pontos que precisam ser corrigidos.',
    sample: 'assunto: oi\n\nmanda meu contrato de novo pq perdi aqui. valeu',
    options: [
      { id: 'no-clear-subject', label: 'Assunto pouco claro', isMistake: true, explanation: 'O assunto deve indicar o pedido, por exemplo: “Reenvio de contrato de aprendizagem”.' },
      { id: 'informal-tone', label: 'Tom informal demais', isMistake: true, explanation: 'Gírias e abreviações reduzem a clareza em comunicação formal.' },
      { id: 'missing-identification', label: 'Faltam dados para identificação', isMistake: true, explanation: 'Nome completo, turma ou documento ajudam o RH a localizar o cadastro.' },
      { id: 'short-message', label: 'Mensagem objetiva', isMistake: false, explanation: 'Ser breve não é erro; o problema é faltar contexto e formalidade.' },
    ],
  },
  {
    id: 'mistake-cv-experience',
    topic: 'Currículo',
    title: 'Experiência no currículo',
    prompt: 'O trecho abaixo está em um currículo de primeiro emprego.',
    sample: 'Experiência: “faço de tudo, aprendo rápido, qualquer coisa serve”.',
    options: [
      { id: 'generic-claim', label: 'Texto genérico demais', isMistake: true, explanation: 'Frases vagas não mostram competência concreta.' },
      { id: 'desperate-tone', label: 'Tom de desespero', isMistake: true, explanation: '“Qualquer coisa serve” enfraquece a apresentação profissional.' },
      { id: 'no-evidence', label: 'Não traz exemplos ou atividades', isMistake: true, explanation: 'Projetos escolares, cursos e voluntariado podem mostrar experiência inicial.' },
      { id: 'first-job-context', label: 'Ser primeiro emprego', isMistake: false, explanation: 'Não ter experiência formal não é erro; o texto precisa valorizar aprendizados reais.' },
    ],
  },
  {
    id: 'mistake-whatsapp-audio',
    topic: 'Mensagem',
    title: 'Mensagem para liderança',
    prompt: 'Marque os problemas da comunicação.',
    sample: 'Áudio de 2 minutos enviado às 23h: “Então, acho que não vou conseguir amanhã, depois vejo isso aí.”',
    options: [
      { id: 'bad-time', label: 'Horário inadequado sem urgência', isMistake: true, explanation: 'Mensagens fora do expediente devem ser evitadas quando não há urgência.' },
      { id: 'long-audio', label: 'Áudio longo sem resumo', isMistake: true, explanation: 'Assuntos de trabalho precisam ser fáceis de consultar.' },
      { id: 'unclear-status', label: 'Status sem clareza', isMistake: true, explanation: 'A mensagem não informa motivo, impacto nem próximo passo.' },
      { id: 'warns-problem', label: 'Avisar que há um problema', isMistake: false, explanation: 'Avisar é correto; a forma e a clareza precisam melhorar.' },
    ],
  },
  {
    id: 'mistake-interview',
    topic: 'Entrevista',
    title: 'Chegada na entrevista',
    prompt: 'Identifique os pontos de postura que prejudicam a situação.',
    sample: 'A pessoa chega 15 minutos atrasada, entra mexendo no celular e diz: “Foi mal, trânsito sempre é assim”.',
    options: [
      { id: 'late-no-plan', label: 'Atraso sem cuidado prévio', isMistake: true, explanation: 'Entrevista exige planejamento de deslocamento e aviso antecipado se houver imprevisto.' },
      { id: 'phone-entry', label: 'Entrar mexendo no celular', isMistake: true, explanation: 'Isso transmite desatenção no primeiro contato.' },
      { id: 'excuse-tone', label: 'Justificativa sem responsabilidade', isMistake: true, explanation: 'Explicar é diferente de jogar a responsabilidade no trânsito.' },
      { id: 'inform-delay', label: 'Mencionar o motivo do atraso', isMistake: false, explanation: 'Explicar pode ser adequado quando vem com pedido de desculpas e objetividade.' },
    ],
  },
  {
    id: 'mistake-task-update',
    topic: 'Status',
    title: 'Atualização de tarefa',
    prompt: 'A mensagem deveria atualizar o andamento de uma tarefa.',
    sample: '“Tá quase, depois eu mando.”',
    options: [
      { id: 'no-percentage', label: 'Não indica avanço real', isMistake: true, explanation: 'Status útil informa o que já foi feito ou quanto falta.' },
      { id: 'no-deadline', label: 'Não informa previsão', isMistake: true, explanation: 'Sem horário ou prazo, a equipe não consegue se organizar.' },
      { id: 'vague-language', label: 'Linguagem vaga', isMistake: true, explanation: '“Quase” e “depois” não ajudam na tomada de decisão.' },
      { id: 'short-status', label: 'Status curto', isMistake: false, explanation: 'Status pode ser curto, desde que seja objetivo.' },
    ],
  },
  {
    id: 'mistake-cv-contact',
    topic: 'Currículo',
    title: 'Dados de contato',
    prompt: 'Observe os dados de contato do currículo.',
    sample: 'E-mail: gatinho_top_2008@email.com\nTelefone: só chamar no direct\nEndereço completo com número e complemento.',
    options: [
      { id: 'unprofessional-email', label: 'E-mail pouco profissional', isMistake: true, explanation: 'O ideal é usar e-mail simples com nome ou iniciais.' },
      { id: 'no-phone', label: 'Telefone sem número direto', isMistake: true, explanation: 'Recrutador precisa de um canal claro para contato.' },
      { id: 'too-much-address', label: 'Endereço detalhado demais', isMistake: true, explanation: 'Cidade e bairro costumam bastar; dados sensíveis devem ser evitados.' },
      { id: 'has-email', label: 'Informar e-mail', isMistake: false, explanation: 'Ter e-mail é importante; o problema é o formato escolhido.' },
    ],
  },
  {
    id: 'mistake-feedback-response',
    topic: 'Feedback',
    title: 'Resposta ao feedback',
    prompt: 'Marque o que precisa ser corrigido na reação.',
    sample: 'Ao ouvir uma correção, a pessoa responde: “Mas ninguém explicou. Se ficou ruim, não é culpa minha.”',
    options: [
      { id: 'defensive-tone', label: 'Tom defensivo', isMistake: true, explanation: 'Defensiva bloqueia a conversa e passa pouca abertura para aprender.' },
      { id: 'no-action', label: 'Não propõe ação de melhoria', isMistake: true, explanation: 'Uma boa resposta combina o que será ajustado.' },
      { id: 'blame-shift', label: 'Transfere culpa', isMistake: true, explanation: 'Apontar culpados antes de entender o problema piora o diálogo.' },
      { id: 'asks-context', label: 'Mencionar falta de explicação', isMistake: false, explanation: 'Pedir contexto pode ser válido quando feito com respeito e foco em solução.' },
    ],
  },
  {
    id: 'mistake-meeting-note',
    topic: 'Reunião',
    title: 'Registro de combinado',
    prompt: 'Avalie o registro feito depois de uma orientação.',
    sample: 'Anotação: “ver coisa da planilha qualquer dia”.',
    options: [
      { id: 'unclear-task', label: 'Tarefa indefinida', isMistake: true, explanation: 'A anotação precisa dizer o que será feito.' },
      { id: 'missing-deadline', label: 'Sem prazo', isMistake: true, explanation: 'Sem prazo, fica difícil priorizar.' },
      { id: 'missing-owner', label: 'Sem responsável ou próximo passo', isMistake: true, explanation: 'Registros bons deixam claro quem faz e qual é o próximo passo.' },
      { id: 'takes-note', label: 'Fazer anotação', isMistake: false, explanation: 'Anotar é positivo; o conteúdo precisa ser claro.' },
    ],
  },
  {
    id: 'mistake-customer-chat',
    topic: 'Atendimento',
    title: 'Resposta a uma dúvida',
    prompt: 'Marque os problemas da resposta.',
    sample: 'Cliente: “Qual documento preciso enviar?”\nResposta: “Tá no site, olha lá.”',
    options: [
      { id: 'rude-tone', label: 'Tom pouco acolhedor', isMistake: true, explanation: 'A resposta soa ríspida e não ajuda a pessoa.' },
      { id: 'no-direction', label: 'Não direciona para o local exato', isMistake: true, explanation: 'Se for orientar pelo site, indique seção ou link.' },
      { id: 'no-answer', label: 'Não responde à dúvida', isMistake: true, explanation: 'A pessoa perguntou documento; a resposta deveria listar ou encaminhar com clareza.' },
      { id: 'uses-official-source', label: 'Usar o site como fonte', isMistake: false, explanation: 'Fonte oficial é boa; o erro é a forma vaga e pouco cordial.' },
    ],
  },
  {
    id: 'mistake-team-group',
    topic: 'Equipe',
    title: 'Grupo da equipe',
    prompt: 'Identifique o que não funciona na mensagem.',
    sample: '“Gente, alguém fez errado de novo. Assim fica impossível trabalhar.”',
    options: [
      { id: 'public-blame', label: 'Culpa pública sem contexto', isMistake: true, explanation: 'Expor pessoas no grupo pode gerar conflito e não resolve o problema.' },
      { id: 'no-specific-problem', label: 'Não especifica o erro', isMistake: true, explanation: 'Sem apontar o problema concreto, ninguém sabe o que corrigir.' },
      { id: 'no-solution', label: 'Não propõe próximo passo', isMistake: true, explanation: 'Comunicação profissional orienta solução.' },
      { id: 'mentions-problem', label: 'Avisar que existe um erro', isMistake: false, explanation: 'Avisar é necessário; o cuidado está na forma.' },
    ],
  },
  {
    id: 'mistake-cover-letter',
    topic: 'Candidatura',
    title: 'Mensagem de candidatura',
    prompt: 'A mensagem será enviada junto com um currículo.',
    sample: '“Oi, vi a vaga aí. Preciso trabalhar logo. Se quiser chama.”',
    options: [
      { id: 'no-vacancy-reference', label: 'Não identifica a vaga', isMistake: true, explanation: 'A pessoa precisa saber para qual oportunidade você está se candidatando.' },
      { id: 'weak-professional-tone', label: 'Tom pouco profissional', isMistake: true, explanation: 'A mensagem deve demonstrar interesse sem parecer descuidada.' },
      { id: 'no-skill-connection', label: 'Não conecta habilidades à vaga', isMistake: true, explanation: 'Uma frase curta sobre curso, interesse ou disponibilidade fortalece a candidatura.' },
      { id: 'short-application', label: 'Ser uma mensagem curta', isMistake: false, explanation: 'Mensagem curta pode funcionar quando traz as informações certas.' },
    ],
  },
  {
    id: 'mistake-document-request',
    topic: 'Documentos',
    title: 'Pedido de documento',
    prompt: 'Observe a solicitação enviada ao setor responsável.',
    sample: '“Preciso daquele papel urgente. Me manda hoje.”',
    options: [
      { id: 'which-document', label: 'Não diz qual documento', isMistake: true, explanation: 'O pedido precisa nomear o documento com clareza.' },
      { id: 'deadline-pressure', label: 'Pressiona sem contexto', isMistake: true, explanation: 'Se é urgente, explique o motivo e pergunte a possibilidade.' },
      { id: 'missing-identification-doc', label: 'Faltam dados de identificação', isMistake: true, explanation: 'Nome, turma ou matrícula ajudam a localizar o pedido.' },
      { id: 'has-deadline', label: 'Informar prazo desejado', isMistake: false, explanation: 'Pedir prazo pode ser válido; o problema é a forma vaga e impositiva.' },
    ],
  },
  {
    id: 'mistake-late-warning',
    topic: 'Pontualidade',
    title: 'Aviso de atraso',
    prompt: 'Analise a mensagem enviada ao líder.',
    sample: '“Acho que vou chegar uma hora aí, trânsito tá osso kkk.”',
    options: [
      { id: 'imprecise-time', label: 'Previsão imprecisa', isMistake: true, explanation: 'O aviso precisa ter estimativa realista de chegada.' },
      { id: 'bad-tone-delay', label: 'Tom informal para situação séria', isMistake: true, explanation: 'Atraso deve ser comunicado com objetividade e responsabilidade.' },
      { id: 'no-apology', label: 'Não assume impacto', isMistake: true, explanation: 'Uma mensagem melhor reconhece o atraso e seu efeito na rotina.' },
      { id: 'warn-delay', label: 'Avisar antes de chegar', isMistake: false, explanation: 'Avisar antes é correto; a mensagem precisa melhorar.' },
    ],
  },
  {
    id: 'mistake-learning-note',
    topic: 'Aprendizado',
    title: 'Anotação de processo',
    prompt: 'A pessoa anotou os passos de um processo novo.',
    sample: '“1. abrir sistema\n2. fazer negócio\n3. conferir lá\n4. mandar pra pessoa”',
    options: [
      { id: 'vague-steps', label: 'Passos vagos', isMistake: true, explanation: 'A anotação deve permitir repetir o processo depois.' },
      { id: 'missing-system-area', label: 'Não indica tela ou área do sistema', isMistake: true, explanation: 'Detalhes mínimos evitam nova dúvida.' },
      { id: 'missing-recipient', label: 'Não identifica destinatário', isMistake: true, explanation: '“Pessoa” não ajuda a saber quem deve receber.' },
      { id: 'numbered-list', label: 'Usar lista numerada', isMistake: false, explanation: 'Lista numerada é boa; o problema é falta de precisão.' },
    ],
  },
  {
    id: 'mistake-feedback-chat',
    topic: 'Feedback',
    title: 'Pedido de feedback',
    prompt: 'A pessoa quer saber como melhorar uma entrega.',
    sample: '“E aí, ficou ruim mesmo ou é implicância?”',
    options: [
      { id: 'accusatory-tone', label: 'Tom acusatório', isMistake: true, explanation: 'A pergunta já começa criando defensiva.' },
      { id: 'no-specific-question', label: 'Não pede ponto específico', isMistake: true, explanation: 'Pedir exemplo ou prioridade de melhoria gera resposta mais útil.' },
      { id: 'informal-feedback', label: 'Informalidade excessiva', isMistake: true, explanation: 'O contexto pede tom mais profissional.' },
      { id: 'asks-feedback', label: 'Buscar retorno sobre a entrega', isMistake: false, explanation: 'Pedir feedback é positivo quando feito de forma construtiva.' },
    ],
  },
  {
    id: 'mistake-priority-message',
    topic: 'Prioridade',
    title: 'Conflito de prioridades',
    prompt: 'A pessoa recebeu duas tarefas urgentes.',
    sample: '“Vou fazer uma qualquer primeiro e depois vejo a outra.”',
    options: [
      { id: 'random-priority', label: 'Escolha sem critério', isMistake: true, explanation: 'Prioridade deve considerar prazo, impacto e orientação.' },
      { id: 'no-alignment', label: 'Não pede alinhamento', isMistake: true, explanation: 'Quando há conflito, alinhar com responsável evita decisão errada.' },
      { id: 'vague-next-step', label: 'Próximo passo vago', isMistake: true, explanation: '“Depois vejo” não dá previsibilidade.' },
      { id: 'sequence-work', label: 'Resolver uma tarefa por vez', isMistake: false, explanation: 'Fazer em sequência pode ser bom quando a ordem foi bem definida.' },
    ],
  },
];
