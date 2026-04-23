import type { PriorityOrderScenario } from '../../../types/realtime.ts';
import {
  normalizeContentKey,
  type MatchContentMetadata,
} from '../contentDiversity.ts';

export type PriorityOrderCatalogEntry = PriorityOrderScenario & MatchContentMetadata;

const priorityOrderDifficulties: Record<string, MatchContentMetadata['difficulty']> = {
  'priority-delay-arrival': 'easy',
  'priority-interview-prep': 'easy',
  'priority-error-sent': 'medium',
  'priority-task-conflict': 'medium',
  'priority-doubt-task': 'easy',
  'priority-start-shift': 'easy',
  'priority-feedback-action': 'medium',
  'priority-customer-complaint': 'medium',
  'priority-confidential-document': 'hard',
  'priority-new-tool': 'medium',
  'priority-team-conflict': 'medium',
  'priority-first-week': 'easy',
  'priority-client-return': 'medium',
  'priority-short-deadline': 'medium',
  'priority-professional-message': 'easy',
  'priority-document-admission': 'medium',
  'priority-safety-risk': 'hard',
  'priority-learning-task': 'easy',
  'priority-team-support': 'medium',
  'priority-curriculum-review': 'easy',
};

function definePriorityOrderScenario(scenario: PriorityOrderScenario): PriorityOrderCatalogEntry {
  const contentGroup = normalizeContentKey(scenario.topic);

  return {
    ...scenario,
    difficulty: priorityOrderDifficulties[scenario.id] ?? 'medium',
    contentGroup,
    sessionTags: [contentGroup, normalizeContentKey(scenario.title)],
  };
}

const priorityOrderItems: PriorityOrderScenario[] = [
  {
    id: 'priority-delay-arrival',
    title: 'Chegada atrasada',
    topic: 'Pontualidade',
    scenario: 'Voce percebe que vai chegar atrasado em uma atividade com a equipe.',
    explanation: 'A prioridade e reduzir impacto: avisar cedo, atualizar previsao, chegar pronto e depois ajustar pendencias.',
    items: [
      {
        id: 'delay-contact-leader',
        text: 'Avisar o lider assim que perceber o atraso.',
        idealPosition: 1,
        explanation: 'Comunicar cedo ajuda a equipe a se organizar.',
      },
      {
        id: 'delay-share-eta',
        text: 'Informar previsao realista de chegada.',
        idealPosition: 2,
        explanation: 'A previsao permite decidir se alguem cobre sua parte.',
      },
      {
        id: 'delay-arrive-ready',
        text: 'Ao chegar, entrar na atividade sem prolongar justificativas.',
        idealPosition: 3,
        explanation: 'Depois do aviso, o foco deve voltar para a entrega.',
      },
      {
        id: 'delay-adjust-later',
        text: 'Depois da atividade, combinar como evitar repeticao.',
        idealPosition: 4,
        explanation: 'A melhoria de rotina vem depois que o impacto imediato foi tratado.',
      },
    ],
  },
  {
    id: 'priority-interview-prep',
    title: 'Preparacao para entrevista',
    topic: 'Entrevista',
    scenario: 'Voce tem uma entrevista amanha e precisa organizar a preparacao.',
    explanation: 'A melhor ordem reduz risco operacional primeiro e deixa o treino mais focado depois.',
    items: [
      {
        id: 'interview-confirm-info',
        text: 'Confirmar horario, endereco/link e documentos necessarios.',
        idealPosition: 1,
        explanation: 'Sem dados basicos confirmados, o restante pode falhar.',
      },
      {
        id: 'interview-research-company',
        text: 'Pesquisar a empresa e a vaga.',
        idealPosition: 2,
        explanation: 'Entender o contexto melhora suas respostas.',
      },
      {
        id: 'interview-prepare-examples',
        text: 'Separar exemplos de experiencias e aprendizados.',
        idealPosition: 3,
        explanation: 'Exemplos concretos deixam a conversa mais clara.',
      },
      {
        id: 'interview-plan-route',
        text: 'Planejar roupa, rota e margem de chegada.',
        idealPosition: 4,
        explanation: 'A logistica final evita correria no dia.',
      },
    ],
  },
  {
    id: 'priority-error-sent',
    title: 'Erro enviado',
    topic: 'Responsabilidade',
    scenario: 'Voce enviou um arquivo e percebeu que uma informacao importante esta errada.',
    explanation: 'Quando ha erro, primeiro contenha o impacto, depois corrija e aprenda com o processo.',
    items: [
      {
        id: 'error-stop-use',
        text: 'Avisar para desconsiderarem a versao enviada.',
        idealPosition: 1,
        explanation: 'Evita que a versao errada continue circulando.',
      },
      {
        id: 'error-correct-file',
        text: 'Corrigir o arquivo com atencao.',
        idealPosition: 2,
        explanation: 'A correcao precisa atacar a causa do erro.',
      },
      {
        id: 'error-send-context',
        text: 'Reenviar explicando objetivamente o que mudou.',
        idealPosition: 3,
        explanation: 'Contexto ajuda a pessoa a usar a versao certa.',
      },
      {
        id: 'error-review-checklist',
        text: 'Criar um checklist simples para proximas entregas.',
        idealPosition: 4,
        explanation: 'A prevencao vem depois da correcao imediata.',
      },
    ],
  },
  {
    id: 'priority-task-conflict',
    title: 'Tarefas em conflito',
    topic: 'Prioridade',
    scenario: 'Duas tarefas urgentes chegam ao mesmo tempo e voce nao consegue concluir ambas hoje.',
    explanation: 'Prioridade real nasce de alinhamento, nao de promessa apressada.',
    items: [
      {
        id: 'conflict-map-deadlines',
        text: 'Levantar prazo, impacto e dependencia de cada tarefa.',
        idealPosition: 1,
        explanation: 'Sem entender impacto, a escolha vira chute.',
      },
      {
        id: 'conflict-align-owner',
        text: 'Alinhar com os responsaveis qual vem primeiro.',
        idealPosition: 2,
        explanation: 'A decisao precisa ser compartilhada com quem depende da entrega.',
      },
      {
        id: 'conflict-commit-one',
        text: 'Assumir um prazo realista para a prioridade escolhida.',
        idealPosition: 3,
        explanation: 'Promessa clara evita expectativa falsa.',
      },
      {
        id: 'conflict-update-other',
        text: 'Avisar o novo prazo da tarefa que ficara depois.',
        idealPosition: 4,
        explanation: 'Quem espera a outra tarefa tambem precisa de visibilidade.',
      },
    ],
  },
  {
    id: 'priority-doubt-task',
    title: 'Duvida na tarefa',
    topic: 'Pedir ajuda',
    scenario: 'Voce recebeu uma tarefa nova, mas nao entendeu exatamente o resultado esperado.',
    explanation: 'A ordem ideal transforma incerteza em alinhamento antes de gastar tempo executando errado.',
    items: [
      {
        id: 'doubt-read-brief',
        text: 'Revisar o pedido e listar o que ficou incerto.',
        idealPosition: 1,
        explanation: 'Chegar com duvidas claras facilita ajuda rapida.',
      },
      {
        id: 'doubt-ask-goal',
        text: 'Perguntar objetivo, prazo e criterio de sucesso.',
        idealPosition: 2,
        explanation: 'Essas tres informacoes definem a direcao da entrega.',
      },
      {
        id: 'doubt-confirm-plan',
        text: 'Confirmar em uma frase o plano combinado.',
        idealPosition: 3,
        explanation: 'Repetir o combinado reduz mal-entendido.',
      },
      {
        id: 'doubt-execute-first-step',
        text: 'Executar a primeira parte e validar se esta no caminho certo.',
        idealPosition: 4,
        explanation: 'Validacao curta evita retrabalho grande.',
      },
    ],
  },
  {
    id: 'priority-start-shift',
    title: 'Inicio do expediente',
    topic: 'Organizacao',
    scenario: 'Voce acabou de chegar e precisa organizar a manha de trabalho.',
    explanation: 'Comecar pelo que orienta o dia ajuda a usar energia e tempo no que importa.',
    items: [
      {
        id: 'shift-check-agenda',
        text: 'Ver agenda, mensagens importantes e prazos do dia.',
        idealPosition: 1,
        explanation: 'Primeiro e preciso entender o que mudou ou vence hoje.',
      },
      {
        id: 'shift-rank-tasks',
        text: 'Ordenar tarefas por prazo e impacto.',
        idealPosition: 2,
        explanation: 'A lista organizada evita comecar pelo mais facil sem criterio.',
      },
      {
        id: 'shift-start-priority',
        text: 'Comecar pela tarefa mais importante.',
        idealPosition: 3,
        explanation: 'Depois de priorizar, a execucao deve comecar.',
      },
      {
        id: 'shift-update-progress',
        text: 'Atualizar o andamento ao longo da manha.',
        idealPosition: 4,
        explanation: 'Atualizacao acontece depois que ha progresso real.',
      },
    ],
  },
  {
    id: 'priority-feedback-action',
    title: 'Feedback recebido',
    topic: 'Feedback',
    scenario: 'Seu lider disse que suas entregas precisam ser mais claras.',
    explanation: 'Feedback vira melhoria quando voce entende, combina uma acao e testa na proxima entrega.',
    items: [
      {
        id: 'feedback-listen',
        text: 'Ouvir sem interromper e anotar o ponto principal.',
        idealPosition: 1,
        explanation: 'Antes de responder, e preciso entender.',
      },
      {
        id: 'feedback-ask-example',
        text: 'Pedir um exemplo concreto do problema.',
        idealPosition: 2,
        explanation: 'Exemplo transforma critica em informacao acionavel.',
      },
      {
        id: 'feedback-agree-adjustment',
        text: 'Combinar um ajuste claro para a proxima entrega.',
        idealPosition: 3,
        explanation: 'A melhoria precisa virar comportamento observavel.',
      },
      {
        id: 'feedback-apply-review',
        text: 'Aplicar o ajuste e pedir revisao depois.',
        idealPosition: 4,
        explanation: 'Revisao fecha o ciclo de aprendizado.',
      },
    ],
  },
  {
    id: 'priority-customer-complaint',
    title: 'Reclamacao recebida',
    topic: 'Comunicacao',
    scenario: 'Uma pessoa manda uma mensagem irritada reclamando de um atendimento.',
    explanation: 'Em atendimento, a ordem segura e acolher, entender, encaminhar e registrar.',
    items: [
      {
        id: 'complaint-acknowledge',
        text: 'Responder com calma reconhecendo a situacao.',
        idealPosition: 1,
        explanation: 'Acolhimento reduz tensao inicial.',
      },
      {
        id: 'complaint-get-info',
        text: 'Pedir ou conferir informacoes necessarias.',
        idealPosition: 2,
        explanation: 'Sem dados, o encaminhamento pode ser errado.',
      },
      {
        id: 'complaint-next-step',
        text: 'Informar o proximo passo e prazo de retorno.',
        idealPosition: 3,
        explanation: 'A pessoa precisa saber o que vai acontecer.',
      },
      {
        id: 'complaint-register',
        text: 'Registrar o caso para acompanhamento.',
        idealPosition: 4,
        explanation: 'Registro ajuda a equipe a nao perder historico.',
      },
    ],
  },
  {
    id: 'priority-confidential-document',
    title: 'Documento sensivel',
    topic: 'Etica',
    scenario: 'Voce encontrou um arquivo interno que parece ter sido compartilhado com o grupo errado.',
    explanation: 'Com informacao sensivel, a prioridade e conter exposicao e acionar a pessoa correta.',
    items: [
      {
        id: 'confidential-stop-share',
        text: 'Nao abrir nem compartilhar mais o conteudo.',
        idealPosition: 1,
        explanation: 'Evita ampliar o problema.',
      },
      {
        id: 'confidential-alert-owner',
        text: 'Avisar discretamente a pessoa responsavel.',
        idealPosition: 2,
        explanation: 'Quem tem autoridade precisa corrigir o acesso.',
      },
      {
        id: 'confidential-delete-copy',
        text: 'Remover qualquer copia local se orientado.',
        idealPosition: 3,
        explanation: 'Remocao deve seguir orientacao para nao atrapalhar rastreio.',
      },
    ],
  },
  {
    id: 'priority-new-tool',
    title: 'Ferramenta nova',
    topic: 'Aprendizado',
    scenario: 'Voce precisa usar uma ferramenta que ainda nao domina para uma entrega simples.',
    explanation: 'A melhor sequencia combina clareza, referencia e execucao curta com validacao.',
    items: [
      {
        id: 'tool-define-task',
        text: 'Entender exatamente qual resultado precisa sair da ferramenta.',
        idealPosition: 1,
        explanation: 'Aprender tudo sem objetivo consome tempo.',
      },
      {
        id: 'tool-find-reference',
        text: 'Pedir exemplo, tutorial interno ou referencia usada pela equipe.',
        idealPosition: 2,
        explanation: 'Referencia certa reduz tentativa aleatoria.',
      },
      {
        id: 'tool-try-small',
        text: 'Fazer uma primeira versao simples.',
        idealPosition: 3,
        explanation: 'Versao pequena permite testar rapido.',
      },
      {
        id: 'tool-validate-output',
        text: 'Validar se o formato atende ao esperado.',
        idealPosition: 4,
        explanation: 'Validacao garante que o aprendizado virou entrega util.',
      },
    ],
  },
  {
    id: 'priority-team-conflict',
    title: 'Discussao na equipe',
    topic: 'Postura',
    scenario: 'Dois colegas comecam a discutir durante uma atividade em grupo.',
    explanation: 'A postura produtiva e reduzir atrito, recuperar foco e pedir apoio se necessario.',
    items: [
      {
        id: 'conflict-stay-neutral',
        text: 'Manter postura neutra e evitar tomar partido.',
        idealPosition: 1,
        explanation: 'Entrar no conflito costuma piorar a conversa.',
      },
      {
        id: 'conflict-refocus-task',
        text: 'Sugerir voltar ao objetivo da atividade.',
        idealPosition: 2,
        explanation: 'O foco comum ajuda a baixar a tensao.',
      },
      {
        id: 'conflict-escalate-if-needed',
        text: 'Chamar uma pessoa responsavel se a discussao continuar.',
        idealPosition: 3,
        explanation: 'Apoio externo e melhor que improvisar mediacao sem espaco.',
      },
    ],
  },
  {
    id: 'priority-first-week',
    title: 'Primeira semana',
    topic: 'Adaptacao',
    scenario: 'Voce esta na primeira semana e quer se adaptar bem ao novo ambiente.',
    explanation: 'A adaptacao melhora quando voce entende regras, observa a rotina, pergunta bem e registra aprendizados.',
    items: [
      {
        id: 'week-understand-rules',
        text: 'Entender horarios, canais e combinados basicos.',
        idealPosition: 1,
        explanation: 'Regras basicas evitam erros de convivencia.',
      },
      {
        id: 'week-observe-routine',
        text: 'Observar como a equipe organiza demandas.',
        idealPosition: 2,
        explanation: 'Observar antes de agir ajuda a entender o contexto.',
      },
      {
        id: 'week-ask-specific',
        text: 'Fazer perguntas especificas quando houver duvida.',
        idealPosition: 3,
        explanation: 'Perguntas claras aceleram aprendizado.',
      },
      {
        id: 'week-note-learning',
        text: 'Anotar aprendizados e proximos passos.',
        idealPosition: 4,
        explanation: 'Registro evita repetir a mesma duvida.',
      },
    ],
  },
  {
    id: 'priority-client-return',
    title: 'Retorno pendente',
    topic: 'Atendimento',
    scenario: 'Uma pessoa aguarda retorno e voce ainda depende de outra area para responder.',
    explanation: 'A melhor ordem evita deixar a pessoa sem resposta e reduz promessa falsa.',
    items: [
      {
        id: 'return-check-status',
        text: 'Conferir o status real com a area responsavel.',
        idealPosition: 1,
        explanation: 'Antes de responder, e preciso saber o que ja existe de informacao.',
      },
      {
        id: 'return-update-person',
        text: 'Avisar que a verificacao esta em andamento e dar previsao de retorno.',
        idealPosition: 2,
        explanation: 'Previsibilidade reduz ansiedade e evita abandono percebido.',
      },
      {
        id: 'return-record-case',
        text: 'Registrar o contato e o prazo combinado.',
        idealPosition: 3,
        explanation: 'Registro ajuda a acompanhar o caso sem perder historico.',
      },
      {
        id: 'return-final-answer',
        text: 'Enviar a resposta final assim que a area retornar.',
        idealPosition: 4,
        explanation: 'A resposta final vem depois de confirmada.',
      },
    ],
  },
  {
    id: 'priority-short-deadline',
    title: 'Prazo curto',
    topic: 'Prioridade',
    scenario: 'Voce recebe uma tarefa importante com prazo curto e varias partes pequenas.',
    explanation: 'Em prazo curto, primeiro entenda valor e risco, depois execute em blocos verificaveis.',
    items: [
      {
        id: 'deadline-clarify-output',
        text: 'Confirmar qual resultado minimo precisa estar pronto.',
        idealPosition: 1,
        explanation: 'O minimo necessario orienta o que nao pode ficar de fora.',
      },
      {
        id: 'deadline-split-steps',
        text: 'Dividir a tarefa em passos menores.',
        idealPosition: 2,
        explanation: 'Passos menores reduzem travamento e facilitam acompanhamento.',
      },
      {
        id: 'deadline-do-critical',
        text: 'Executar primeiro a parte mais critica.',
        idealPosition: 3,
        explanation: 'O que mais impacta o resultado deve vir antes.',
      },
      {
        id: 'deadline-update-progress',
        text: 'Atualizar andamento e impedimentos.',
        idealPosition: 4,
        explanation: 'Comunicar progresso permite ajuste antes do prazo acabar.',
      },
    ],
  },
  {
    id: 'priority-professional-message',
    title: 'Mensagem profissional',
    topic: 'Comunicacao',
    scenario: 'Voce precisa pedir ajuda por mensagem sem parecer seco nem confuso.',
    explanation: 'Mensagem profissional fica melhor quando traz contexto, pedido e proximo passo.',
    items: [
      {
        id: 'message-state-context',
        text: 'Explicar em uma frase o contexto da tarefa.',
        idealPosition: 1,
        explanation: 'Contexto ajuda a pessoa a entender o problema.',
      },
      {
        id: 'message-state-doubt',
        text: 'Dizer exatamente qual duvida ou bloqueio existe.',
        idealPosition: 2,
        explanation: 'Pedido claro facilita resposta util.',
      },
      {
        id: 'message-suggest-time',
        text: 'Sugerir uma forma ou horario curto para alinhar.',
        idealPosition: 3,
        explanation: 'Proximo passo transforma a mensagem em acao.',
      },
    ],
  },
  {
    id: 'priority-document-admission',
    title: 'Documentos de admissao',
    topic: 'Admissao',
    scenario: 'A empresa pediu documentos para seguir com a admissao e voce precisa organizar tudo.',
    explanation: 'Primeiro entenda a lista oficial, depois organize documentos e proteja dados sensiveis.',
    items: [
      {
        id: 'docs-read-list',
        text: 'Ler a lista oficial de documentos solicitados.',
        idealPosition: 1,
        explanation: 'A lista evita enviar coisa errada ou incompleta.',
      },
      {
        id: 'docs-separate-valid',
        text: 'Separar documentos atualizados e legiveis.',
        idealPosition: 2,
        explanation: 'Documento ruim pode atrasar o processo.',
      },
      {
        id: 'docs-check-sensitive',
        text: 'Conferir se nao esta compartilhando senha ou dado indevido.',
        idealPosition: 3,
        explanation: 'Dados sensiveis exigem cuidado mesmo em admissao.',
      },
      {
        id: 'docs-send-channel',
        text: 'Enviar pelo canal indicado e confirmar recebimento.',
        idealPosition: 4,
        explanation: 'Canal correto e confirmacao fecham o envio.',
      },
    ],
  },
  {
    id: 'priority-safety-risk',
    title: 'Risco de seguranca',
    topic: 'Seguranca',
    scenario: 'Voce percebe um cabo solto em area de circulacao durante a rotina.',
    explanation: 'Risco fisico precisa ser sinalizado e encaminhado antes de virar acidente.',
    items: [
      {
        id: 'risk-avoid-area',
        text: 'Evitar que pessoas passem pelo local se for seguro fazer isso.',
        idealPosition: 1,
        explanation: 'A prioridade e reduzir o risco imediato.',
      },
      {
        id: 'risk-alert-responsible',
        text: 'Avisar a pessoa ou area responsavel pela seguranca.',
        idealPosition: 2,
        explanation: 'Quem tem responsabilidade tecnica deve resolver.',
      },
      {
        id: 'risk-register',
        text: 'Registrar o problema conforme o combinado da empresa.',
        idealPosition: 3,
        explanation: 'Registro ajuda a acompanhar a solucao.',
      },
      {
        id: 'risk-follow-up',
        text: 'Confirmar depois se o local foi liberado.',
        idealPosition: 4,
        explanation: 'Acompanhamento evita que o risco volte a passar despercebido.',
      },
    ],
  },
  {
    id: 'priority-learning-task',
    title: 'Aprender tarefa nova',
    topic: 'Aprendizado',
    scenario: 'Voce vai executar uma tarefa pela primeira vez com supervisao.',
    explanation: 'Aprender bem envolve observar, repetir com orientacao e registrar para ganhar autonomia.',
    items: [
      {
        id: 'learn-watch-demo',
        text: 'Observar uma demonstracao ou exemplo correto.',
        idealPosition: 1,
        explanation: 'Referencia inicial reduz tentativa errada.',
      },
      {
        id: 'learn-repeat-guided',
        text: 'Executar uma primeira vez com acompanhamento.',
        idealPosition: 2,
        explanation: 'Pratica guiada transforma observacao em habilidade.',
      },
      {
        id: 'learn-note-steps',
        text: 'Anotar passos e pontos de atencao.',
        idealPosition: 3,
        explanation: 'Registro evita repetir a mesma duvida.',
      },
      {
        id: 'learn-try-alone',
        text: 'Fazer a proxima tentativa sozinho e pedir revisao.',
        idealPosition: 4,
        explanation: 'Autonomia cresce com tentativa e feedback.',
      },
    ],
  },
  {
    id: 'priority-team-support',
    title: 'Apoio a colega',
    topic: 'Trabalho em equipe',
    scenario: 'Um colega esta atrasado em uma parte que bloqueia a entrega do grupo.',
    explanation: 'Ajudar bem passa por entender o bloqueio, combinar apoio e manter a entrega visivel.',
    items: [
      {
        id: 'support-understand-blocker',
        text: 'Perguntar qual e o bloqueio real.',
        idealPosition: 1,
        explanation: 'Sem entender o bloqueio, a ajuda pode nao resolver.',
      },
      {
        id: 'support-align-owner',
        text: 'Combinar com o grupo quem pode apoiar sem abandonar a propria parte.',
        idealPosition: 2,
        explanation: 'Apoio precisa preservar o conjunto da entrega.',
      },
      {
        id: 'support-help-specific',
        text: 'Ajudar em uma parte especifica e limitada.',
        idealPosition: 3,
        explanation: 'Ajuda focada e mais eficiente.',
      },
      {
        id: 'support-update-status',
        text: 'Atualizar o andamento para a equipe.',
        idealPosition: 4,
        explanation: 'Todos precisam saber se o bloqueio foi resolvido.',
      },
    ],
  },
  {
    id: 'priority-curriculum-review',
    title: 'Revisao de curriculo',
    topic: 'Curriculo',
    scenario: 'Voce quer enviar o curriculo para uma vaga ainda hoje.',
    explanation: 'Antes de enviar, revise dados essenciais, ajuste para a vaga e confira o arquivo final.',
    items: [
      {
        id: 'cv-check-contact',
        text: 'Conferir nome, telefone, e-mail e cidade.',
        idealPosition: 1,
        explanation: 'Contato errado impede retorno do recrutador.',
      },
      {
        id: 'cv-align-objective',
        text: 'Ajustar objetivo ou resumo para a vaga.',
        idealPosition: 2,
        explanation: 'Curriculo generico pode perder forca.',
      },
      {
        id: 'cv-review-errors',
        text: 'Revisar ortografia e informacoes desatualizadas.',
        idealPosition: 3,
        explanation: 'Erros simples passam falta de cuidado.',
      },
      {
        id: 'cv-save-file',
        text: 'Salvar com nome claro e enviar pelo canal pedido.',
        idealPosition: 4,
        explanation: 'Arquivo bem nomeado facilita identificacao.',
      },
    ],
  },
];

export const priorityOrderCatalog: PriorityOrderCatalogEntry[] = priorityOrderItems.map(definePriorityOrderScenario);

export function getPriorityOrderCatalog() {
  return priorityOrderCatalog;
}
