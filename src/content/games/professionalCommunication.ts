export type CommunicationOptionQuality = 'best' | 'ok' | 'poor';

export type CommunicationOption = {
  id: string;
  text: string;
  quality: CommunicationOptionQuality;
  feedback: string;
};

export type ProfessionalCommunicationScenario = {
  id: string;
  topic: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  contentGroup?: string;
  sessionTags?: string[];
  title: string;
  scenario: string;
  bestOptionId: string;
  learningPoint: string;
  options: CommunicationOption[];
};

export const professionalCommunicationScenarios: ProfessionalCommunicationScenario[] = [
  {
    id: 'comm-delay',
    topic: 'Atraso',
    title: 'Você vai atrasar',
    scenario: 'O transporte atrasou e você percebe que chegará cerca de 20 minutos depois do horário.',
    bestOptionId: 'delay-clear',
    learningPoint: 'A melhor mensagem informa o problema cedo, estima chegada e assume responsabilidade.',
    options: [
      { id: 'delay-clear', quality: 'best', text: 'Aviso assim que possível: “Tive um atraso no transporte e devo chegar às 8h20. Sigo atualizando se mudar.”', feedback: 'Clara, objetiva e enviada antes do impacto virar surpresa.' },
      { id: 'delay-short', quality: 'ok', text: 'Mandar apenas: “Vou atrasar um pouco.”', feedback: 'Avisa, mas falta estimativa e contexto para a equipe se organizar.' },
      { id: 'delay-silent', quality: 'poor', text: 'Não avisar para evitar chamar atenção.', feedback: 'Silêncio aumenta o problema e passa falta de responsabilidade.' },
    ],
  },
  {
    id: 'comm-help',
    topic: 'Dúvida',
    title: 'Tarefa não ficou clara',
    scenario: 'Você recebeu uma tarefa nova, tentou começar, mas não entendeu exatamente o resultado esperado.',
    bestOptionId: 'help-specific',
    learningPoint: 'Pedir ajuda com contexto mostra que você tentou avançar e facilita a orientação.',
    options: [
      { id: 'help-specific', quality: 'best', text: '“Revisei o pedido e fiquei em dúvida sobre o formato final. Pode confirmar se devo entregar em planilha ou apresentação?”', feedback: 'Mostra tentativa, dúvida específica e facilita uma resposta rápida.' },
      { id: 'help-generic', quality: 'ok', text: '“Não entendi. Pode explicar de novo?”', feedback: 'É melhor do que travar, mas poderia ser mais específico.' },
      { id: 'help-guess', quality: 'poor', text: 'Fazer do jeito que imaginou, sem validar.', feedback: 'Pode gerar retrabalho e atrasar a entrega.' },
    ],
  },
  {
    id: 'comm-feedback',
    topic: 'Feedback',
    title: 'Recebeu uma crítica',
    scenario: 'Seu líder explicou que sua última entrega teve erros de atenção.',
    bestOptionId: 'feedback-action',
    learningPoint: 'Responder bem a feedback envolve ouvir, confirmar entendimento e combinar uma ação concreta.',
    options: [
      { id: 'feedback-action', quality: 'best', text: '“Entendi. Vou revisar com checklist antes de enviar. Pode me apontar o erro principal para eu corrigir primeiro?”', feedback: 'Recebe o feedback sem defensiva e transforma em ação.' },
      { id: 'feedback-sorry', quality: 'ok', text: '“Desculpa, vou tentar melhorar.”', feedback: 'É respeitoso, mas ainda pouco prático.' },
      { id: 'feedback-excuse', quality: 'poor', text: '“Mas ninguém explicou direito, por isso errei.”', feedback: 'Começar pela justificativa dificulta a conversa e reduz aprendizado.' },
    ],
  },
  {
    id: 'comm-client',
    topic: 'Atendimento',
    title: 'Cliente irritado',
    scenario: 'Uma pessoa reclama com tom duro sobre uma informação que recebeu incompleta.',
    bestOptionId: 'client-calm',
    learningPoint: 'Em atendimento, a resposta precisa reconhecer o problema e encaminhar solução sem confronto.',
    options: [
      { id: 'client-calm', quality: 'best', text: '“Entendo sua frustração. Vou conferir a informação correta agora e te retorno com o próximo passo.”', feedback: 'Acolhe, evita briga e assume encaminhamento.' },
      { id: 'client-transfer', quality: 'ok', text: '“Vou chamar alguém responsável para verificar.”', feedback: 'Pode funcionar, mas falta acolhimento e clareza de acompanhamento.' },
      { id: 'client-react', quality: 'poor', text: '“Não fui eu que passei essa informação.”', feedback: 'Soa defensivo e não resolve a necessidade da pessoa.' },
    ],
  },
  {
    id: 'comm-email',
    topic: 'E-mail',
    title: 'Pedido por e-mail',
    scenario: 'Você precisa pedir a um setor o reenvio de um documento.',
    bestOptionId: 'email-clear',
    learningPoint: 'Assunto claro, pedido direto e dados necessários reduzem troca de mensagens.',
    options: [
      { id: 'email-clear', quality: 'best', text: 'Assunto: “Reenvio de documento - contrato de aprendizagem”. Corpo com nome, data e pedido objetivo.', feedback: 'Ajuda o destinatário a entender e resolver sem adivinhar.' },
      { id: 'email-vague', quality: 'ok', text: 'Assunto: “Documento”. Corpo: “Pode reenviar pra mim?”', feedback: 'Tem pedido, mas faltam dados e contexto.' },
      { id: 'email-chat', quality: 'poor', text: 'Assunto vazio e corpo: “oi, manda aquele negócio aí pfv”.', feedback: 'Informal demais e difícil de processar profissionalmente.' },
    ],
  },
  {
    id: 'comm-team',
    topic: 'Equipe',
    title: 'Conflito no grupo',
    scenario: 'Um colega não entregou uma parte combinada e isso afetou sua tarefa.',
    bestOptionId: 'team-direct',
    learningPoint: 'Comunicação profissional foca no combinado, no impacto e na solução.',
    options: [
      { id: 'team-direct', quality: 'best', text: '“A parte combinada ainda não chegou e preciso dela para finalizar. Consegue me enviar até 15h ou prefere que eu peça orientação?”', feedback: 'É direto, respeitoso e abre caminho para solução.' },
      { id: 'team-hint', quality: 'ok', text: 'Mandar indireta no grupo: “Tem gente esquecendo o combinado.”', feedback: 'Pode até chamar atenção, mas cria ruído e não resolve claramente.' },
      { id: 'team-attack', quality: 'poor', text: 'Expor o colega com crítica pessoal no grupo.', feedback: 'Gera conflito e desvia o foco da entrega.' },
    ],
  },
  {
    id: 'comm-task-done',
    topic: 'Entrega',
    title: 'Entrega concluída',
    scenario: 'Você terminou uma atividade e precisa avisar a pessoa responsável.',
    bestOptionId: 'done-summary',
    learningPoint: 'Aviso de entrega deve dizer o que foi feito, onde está e se há pendências.',
    options: [
      { id: 'done-summary', quality: 'best', text: '“Finalizei a planilha e salvei na pasta combinada. Revisei os totais; ficou pendente só a validação do setor.”', feedback: 'Dá status completo e facilita o próximo passo.' },
      { id: 'done-simple', quality: 'ok', text: '“Terminei.”', feedback: 'Avisa, mas deixa a pessoa procurar detalhes.' },
      { id: 'done-none', quality: 'poor', text: 'Não avisar porque a tarefa já está pronta.', feedback: 'Sem comunicação, a entrega pode ficar parada.' },
    ],
  },
  {
    id: 'comm-meeting',
    topic: 'Reunião',
    title: 'Não poderá participar',
    scenario: 'Você foi chamado para uma reunião no mesmo horário de uma atividade obrigatória.',
    bestOptionId: 'meeting-align',
    learningPoint: 'Quando há conflito de agenda, comunique cedo e peça orientação sobre prioridade.',
    options: [
      { id: 'meeting-align', quality: 'best', text: '“Tenho uma atividade obrigatória no mesmo horário. Qual prioridade devo seguir ou há outro horário possível?”', feedback: 'Mostra conflito real e pede decisão responsável.' },
      { id: 'meeting-skip', quality: 'poor', text: 'Escolher uma das duas sem avisar ninguém.', feedback: 'Pode gerar falta injustificada ou perda de alinhamento.' },
      { id: 'meeting-late', quality: 'ok', text: 'Avisar depois que a reunião acabar.', feedback: 'Ainda comunica, mas tarde demais para reorganizar.' },
    ],
  },
  {
    id: 'comm-whatsapp',
    topic: 'Canal',
    title: 'Canal adequado',
    scenario: 'Você precisa enviar uma informação formal que deve ficar registrada.',
    bestOptionId: 'channel-formal',
    learningPoint: 'Escolher o canal certo evita perda de informação e protege combinados.',
    options: [
      { id: 'channel-formal', quality: 'best', text: 'Enviar por e-mail ou sistema oficial, com assunto claro e dados completos.', feedback: 'Mantém registro e facilita consulta posterior.' },
      { id: 'channel-chat', quality: 'ok', text: 'Mandar por chat e depois confirmar por canal oficial.', feedback: 'Pode acelerar, desde que o registro formal venha em seguida.' },
      { id: 'channel-audio', quality: 'poor', text: 'Mandar áudio longo sem resumo escrito.', feedback: 'Dificulta busca, registro e entendimento rápido.' },
    ],
  },
  {
    id: 'comm-doubt-deadline',
    topic: 'Prazo',
    title: 'Prazo apertado',
    scenario: 'Você percebe que não conseguirá terminar uma demanda no prazo combinado.',
    bestOptionId: 'deadline-early',
    learningPoint: 'Avisar cedo permite renegociar prioridade ou pedir apoio antes do atraso acontecer.',
    options: [
      { id: 'deadline-early', quality: 'best', text: '“Estou na metade e vejo risco de não fechar até 16h. Posso priorizar esta parte ou pedir apoio em X?”', feedback: 'Mostra status, risco e alternativa.' },
      { id: 'deadline-end', quality: 'ok', text: 'Avisar somente no horário final que não deu tempo.', feedback: 'É honesto, mas tarde para correção de rota.' },
      { id: 'deadline-hide', quality: 'poor', text: 'Entregar incompleto sem avisar.', feedback: 'Prejudica a confiança e a organização da equipe.' },
    ],
  },
  {
    id: 'comm-thanks',
    topic: 'Convivência',
    title: 'Agradecer ajuda',
    scenario: 'Um colega parou para explicar um processo importante.',
    bestOptionId: 'thanks-specific',
    learningPoint: 'Agradecimento específico fortalece colaboração e mostra atenção ao aprendizado.',
    options: [
      { id: 'thanks-specific', quality: 'best', text: '“Obrigado por explicar o processo. A parte do checklist me ajudou bastante; vou usar na próxima entrega.”', feedback: 'Reconhece a ajuda de forma concreta.' },
      { id: 'thanks-basic', quality: 'ok', text: '“Valeu.”', feedback: 'É educado, mas pouco cuidadoso para um contexto profissional.' },
      { id: 'thanks-ignore', quality: 'poor', text: 'Sair sem agradecer porque a pessoa só fez obrigação.', feedback: 'Ignora uma atitude colaborativa importante.' },
    ],
  },
  {
    id: 'comm-leader-update',
    topic: 'Status',
    title: 'Atualização de andamento',
    scenario: 'Seu líder pediu uma atualização rápida sobre uma tarefa que ainda está em andamento.',
    bestOptionId: 'status-objective',
    learningPoint: 'Um bom status combina avanço, pendência e próximo passo.',
    options: [
      { id: 'status-objective', quality: 'best', text: '“Concluí 70%. Falta validar os dados de duas linhas e devo enviar até 15h30.”', feedback: 'É objetivo e permite acompanhamento real.' },
      { id: 'status-vague', quality: 'ok', text: '“Está indo.”', feedback: 'Responde, mas não informa avanço nem previsão.' },
      { id: 'status-defensive', quality: 'poor', text: '“Calma, eu já disse que estou fazendo.”', feedback: 'O tom defensivo prejudica a relação e não dá visibilidade.' },
    ],
  },
  {
    id: 'comm-document-missing',
    topic: 'Documentos',
    title: 'Documento pendente',
    scenario: 'O RH pediu um documento que você ainda não encontrou.',
    bestOptionId: 'doc-clear-deadline',
    learningPoint: 'A melhor resposta informa status real e combina prazo de envio.',
    options: [
      { id: 'doc-clear-deadline', quality: 'best', text: '“Ainda estou localizando o documento. Consigo enviar até amanhã às 10h. Esse prazo atende?”', feedback: 'Dá contexto, previsão e abre espaço para ajuste.' },
      { id: 'doc-later', quality: 'ok', text: '“Depois eu mando.”', feedback: 'Avisa que não será agora, mas falta prazo claro.' },
      { id: 'doc-ignore', quality: 'poor', text: 'Não responder até encontrar.', feedback: 'Sem resposta, o processo pode ficar travado sem previsão.' },
    ],
  },
  {
    id: 'comm-correction-sent',
    topic: 'Erro',
    title: 'Mensagem enviada com erro',
    scenario: 'Você percebeu que enviou uma informação errada no grupo da equipe.',
    bestOptionId: 'correction-direct',
    learningPoint: 'Correção boa é rápida, objetiva e deixa a informação certa visível.',
    options: [
      { id: 'correction-direct', quality: 'best', text: '“Corrigindo a informação anterior: o prazo correto é quinta-feira às 15h. Desculpem a confusão.”', feedback: 'Corrige sem enrolar e reduz ruído.' },
      { id: 'correction-delete', quality: 'ok', text: 'Apagar a mensagem e mandar outra sem explicar.', feedback: 'Corrige parcialmente, mas pode deixar dúvidas em quem já leu.' },
      { id: 'correction-hide', quality: 'poor', text: 'Deixar como está para ninguém perceber.', feedback: 'Erro não corrigido pode impactar a rotina da equipe.' },
    ],
  },
  {
    id: 'comm-ask-shift-change',
    topic: 'Rotina',
    title: 'Troca de horário',
    scenario: 'Você precisa pedir uma troca pontual de horário por causa de uma prova.',
    bestOptionId: 'shift-formal',
    learningPoint: 'Pedido profissional explica motivo, data e proposta de compensação quando necessário.',
    options: [
      { id: 'shift-formal', quality: 'best', text: '“Tenho prova na terça às 14h. Posso ajustar meu horário nesse dia ou há outra orientação?”', feedback: 'É claro, respeitoso e pede validação.' },
      { id: 'shift-short', quality: 'ok', text: '“Não vou poder ir no horário de terça.”', feedback: 'Comunica o problema, mas não traz contexto nem alternativa.' },
      { id: 'shift-demand', quality: 'poor', text: '“Vou trocar meu horário terça, beleza?”', feedback: 'Decide sozinho algo que precisa de autorização.' },
    ],
  },
  {
    id: 'comm-learn-process',
    topic: 'Aprendizado',
    title: 'Aprender processo',
    scenario: 'Uma pessoa da equipe explicou um processo rápido, mas você não conseguiu acompanhar tudo.',
    bestOptionId: 'process-checklist',
    learningPoint: 'Pedir um resumo ou checklist evita repetir dúvida e melhora autonomia.',
    options: [
      { id: 'process-checklist', quality: 'best', text: '“Pode me confirmar os passos principais? Vou anotar para não precisar perguntar de novo.”', feedback: 'Mostra compromisso com aprendizado e organização.' },
      { id: 'process-repeat', quality: 'ok', text: '“Pode repetir tudo?”', feedback: 'Ajuda, mas poderia direcionar melhor a dúvida.' },
      { id: 'process-pretend', quality: 'poor', text: 'Fingir que entendeu para não parecer perdido.', feedback: 'Isso aumenta chance de erro depois.' },
    ],
  },
  {
    id: 'comm-client-wait',
    topic: 'Atendimento',
    title: 'Cliente aguardando',
    scenario: 'Você precisa deixar uma pessoa aguardando enquanto confirma uma informação.',
    bestOptionId: 'wait-time',
    learningPoint: 'Boa comunicação de espera informa o que será feito e quanto tempo pode levar.',
    options: [
      { id: 'wait-time', quality: 'best', text: '“Vou confirmar essa informação com o setor responsável. Pode aguardar cerca de 5 minutos?”', feedback: 'Explica a ação e dá expectativa de tempo.' },
      { id: 'wait-generic', quality: 'ok', text: '“Só um minuto.”', feedback: 'É educado, mas pode virar frustração se demorar mais.' },
      { id: 'wait-silent', quality: 'poor', text: 'Sair para perguntar sem avisar nada.', feedback: 'A pessoa fica sem saber se foi atendida ou esquecida.' },
    ],
  },
  {
    id: 'comm-boundary',
    topic: 'Limites',
    title: 'Tarefa fora de orientação',
    scenario: 'Pedem que você faça algo que parece fora da orientação recebida.',
    bestOptionId: 'boundary-validate',
    learningPoint: 'Validar limite antes de agir protege você e a empresa.',
    options: [
      { id: 'boundary-validate', quality: 'best', text: '“Antes de fazer, posso confirmar se essa atividade está dentro da minha orientação?”', feedback: 'Questiona com respeito e segurança.' },
      { id: 'boundary-do', quality: 'poor', text: 'Fazer sem perguntar para mostrar disposição.', feedback: 'Disposição sem validação pode gerar risco.' },
      { id: 'boundary-refuse', quality: 'ok', text: '“Não vou fazer isso.”', feedback: 'Pode ser necessário, mas falta pedir orientação e explicar o motivo.' },
    ],
  },
  {
    id: 'comm-absence',
    topic: 'Ausência',
    title: 'Falta inesperada',
    scenario: 'Você teve um imprevisto familiar e não conseguirá comparecer.',
    bestOptionId: 'absence-early',
    learningPoint: 'Aviso de ausência precisa ser cedo, direto e pelo canal combinado.',
    options: [
      { id: 'absence-early', quality: 'best', text: '“Tive um imprevisto familiar e não conseguirei comparecer hoje. Vou encaminhar a justificativa pelo canal combinado.”', feedback: 'Informa o essencial e sinaliza documentação.' },
      { id: 'absence-friend', quality: 'ok', text: 'Pedir para um colega avisar por você.', feedback: 'Pode ajudar em emergência, mas o ideal é comunicação direta quando possível.' },
      { id: 'absence-late', quality: 'poor', text: 'Avisar apenas no dia seguinte.', feedback: 'Tarde demais para a equipe se organizar.' },
    ],
  },
  {
    id: 'comm-priority-ask',
    topic: 'Prioridade',
    title: 'Duas demandas ao mesmo tempo',
    scenario: 'Duas pessoas pediram tarefas para o mesmo horário e você não conseguirá fazer as duas.',
    bestOptionId: 'priority-align',
    learningPoint: 'Alinhar prioridade evita escolher no improviso e atrasar a demanda errada.',
    options: [
      { id: 'priority-align', quality: 'best', text: '“Recebi as demandas A e B para o mesmo horário. Qual devo priorizar primeiro?”', feedback: 'Traz o conflito com clareza e pede decisão.' },
      { id: 'priority-guess', quality: 'ok', text: 'Escolher a que parece mais fácil.', feedback: 'Pode resolver uma parte, mas não garante prioridade correta.' },
      { id: 'priority-panic', quality: 'poor', text: 'Tentar fazer tudo ao mesmo tempo sem avisar ninguém.', feedback: 'Aumenta chance de atraso e erro.' },
    ],
  },
];
