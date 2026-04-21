import type { WorkSituation } from '../../../types/realtime.ts';
import {
  normalizeContentKey,
  type MatchContentMetadata,
} from '../contentDiversity.ts';

export type WorkSituationCatalogEntry = WorkSituation & MatchContentMetadata;

const workSituationDifficulties: Record<string, MatchContentMetadata['difficulty']> = {
  'work-delay-warning': 'easy',
  'work-task-doubt': 'easy',
  'work-mistake-found': 'medium',
  'work-feedback-hard': 'medium',
  'work-channel-choice': 'easy',
  'work-priority-conflict': 'medium',
  'work-team-conflict': 'medium',
  'work-confidential-info': 'hard',
  'work-customer-message': 'medium',
  'work-idle-moment': 'easy',
  'work-meeting-note': 'easy',
  'work-learning-gap': 'medium',
};

function defineWorkSituation(situation: WorkSituation): WorkSituationCatalogEntry {
  const contentGroup = normalizeContentKey(situation.topic);

  return {
    ...situation,
    difficulty: workSituationDifficulties[situation.id] ?? 'medium',
    contentGroup,
    sessionTags: [contentGroup, normalizeContentKey(situation.title)],
  };
}

const workSituationItems: WorkSituation[] = [
  {
    id: 'work-delay-warning',
    title: 'Atraso no caminho',
    topic: 'Pontualidade',
    scenario: 'Voce percebe que vai chegar 20 minutos atrasado no primeiro dia de uma atividade importante.',
    bestOptionId: 'delay-warn-leader',
    explanation: 'Avisar cedo reduz impacto na equipe e mostra responsabilidade sem tentar esconder o problema.',
    options: [
      {
        id: 'delay-warn-leader',
        text: 'Avisar o lider assim que perceber o atraso e informar a previsao de chegada.',
        quality: 'best',
        basePoints: 1000,
        feedback: 'Boa decisao: comunica cedo, assume a situacao e ajuda a equipe a se reorganizar.',
      },
      {
        id: 'delay-explain-after',
        text: 'Chegar e explicar o motivo apenas quando perguntarem.',
        quality: 'ok',
        basePoints: 600,
        feedback: 'Melhor do que ignorar, mas tarde demais para a equipe se planejar.',
      },
      {
        id: 'delay-say-nothing',
        text: 'Nao avisar para evitar chamar atencao.',
        quality: 'poor',
        basePoints: 0,
        feedback: 'Evitar a comunicacao piora a confianca e deixa a equipe sem contexto.',
      },
    ],
  },
  {
    id: 'work-task-doubt',
    title: 'Tarefa pouco clara',
    topic: 'Pedir ajuda',
    scenario: 'Voce recebeu uma tarefa nova, mas nao entendeu exatamente qual resultado precisa entregar.',
    bestOptionId: 'doubt-clarify-goal',
    explanation: 'Perguntar objetivo, prazo e criterio de sucesso evita retrabalho e mostra cuidado com a entrega.',
    options: [
      {
        id: 'doubt-clarify-goal',
        text: 'Pedir uma explicacao objetiva sobre resultado esperado, prazo e prioridade.',
        quality: 'best',
        basePoints: 1000,
        feedback: 'Boa decisao: transforma duvida em alinhamento antes de executar.',
      },
      {
        id: 'doubt-try-alone',
        text: 'Tentar fazer sozinho e pedir ajuda se travar depois.',
        quality: 'ok',
        basePoints: 600,
        feedback: 'Tem iniciativa, mas pode gastar tempo em uma direcao errada.',
      },
      {
        id: 'doubt-copy-old',
        text: 'Copiar um trabalho antigo sem confirmar se serve.',
        quality: 'poor',
        basePoints: 0,
        feedback: 'Pode gerar erro e passa a impressao de que voce nao validou a necessidade real.',
      },
    ],
  },
  {
    id: 'work-mistake-found',
    title: 'Erro percebido',
    topic: 'Responsabilidade',
    scenario: 'Depois de enviar uma planilha, voce percebe que uma informacao importante ficou errada.',
    bestOptionId: 'mistake-report-fix',
    explanation: 'Assumir rapidamente e propor correcao protege o resultado e fortalece confianca.',
    options: [
      {
        id: 'mistake-report-fix',
        text: 'Avisar quem recebeu, explicar o erro de forma simples e enviar a versao corrigida.',
        quality: 'best',
        basePoints: 1000,
        feedback: 'Boa decisao: voce age rapido, corrige e reduz impacto.',
      },
      {
        id: 'mistake-fix-silent',
        text: 'Corrigir o arquivo e reenviar sem explicar o que mudou.',
        quality: 'ok',
        basePoints: 600,
        feedback: 'Corrige parte do problema, mas deixa a outra pessoa sem clareza sobre a versao correta.',
      },
      {
        id: 'mistake-wait',
        text: 'Esperar alguem notar antes de falar.',
        quality: 'poor',
        basePoints: 0,
        feedback: 'Adiar o aviso aumenta o risco e prejudica a confianca.',
      },
    ],
  },
  {
    id: 'work-feedback-hard',
    title: 'Feedback dificil',
    topic: 'Feedback',
    scenario: 'Seu lider aponta que sua comunicacao nas entregas esta confusa e precisa melhorar.',
    bestOptionId: 'feedback-ask-example',
    explanation: 'Receber feedback com abertura e pedir exemplos transforma critica em plano de melhoria.',
    options: [
      {
        id: 'feedback-ask-example',
        text: 'Agradecer, pedir um exemplo concreto e combinar como melhorar na proxima entrega.',
        quality: 'best',
        basePoints: 1000,
        feedback: 'Boa decisao: voce demonstra maturidade e transforma o feedback em acao.',
      },
      {
        id: 'feedback-just-listen',
        text: 'Ouvir sem responder e tentar melhorar por conta propria.',
        quality: 'ok',
        basePoints: 600,
        feedback: 'Evita conflito, mas perde a chance de entender exatamente o ajuste esperado.',
      },
      {
        id: 'feedback-defend',
        text: 'Explicar que a confusao aconteceu porque as pessoas nao leram direito.',
        quality: 'poor',
        basePoints: 0,
        feedback: 'Transferir a culpa fecha a conversa e reduz a chance de aprendizado.',
      },
    ],
  },
  {
    id: 'work-channel-choice',
    title: 'Canal adequado',
    topic: 'Comunicacao',
    scenario: 'Voce precisa avisar uma mudanca de prazo que afeta duas pessoas da equipe.',
    bestOptionId: 'channel-direct-team',
    explanation: 'Escolher um canal claro e registrar a combinacao evita desencontro de informacoes.',
    options: [
      {
        id: 'channel-direct-team',
        text: 'Enviar uma mensagem direta para os envolvidos com novo prazo, motivo e proximo passo.',
        quality: 'best',
        basePoints: 1000,
        feedback: 'Boa decisao: informacao objetiva para quem precisa agir.',
      },
      {
        id: 'channel-general-chat',
        text: 'Comentar no grupo geral da equipe e torcer para todos verem.',
        quality: 'ok',
        basePoints: 600,
        feedback: 'Pode funcionar, mas a mensagem pode se perder no volume do grupo.',
      },
      {
        id: 'channel-hallway',
        text: 'Falar rapidamente no corredor com uma pessoa e pedir para ela avisar a outra.',
        quality: 'poor',
        basePoints: 0,
        feedback: 'A informacao fica informal demais e aumenta o risco de ruído.',
      },
    ],
  },
  {
    id: 'work-priority-conflict',
    title: 'Duas prioridades',
    topic: 'Prioridade',
    scenario: 'Duas pessoas pedem tarefas urgentes ao mesmo tempo e voce nao consegue entregar as duas hoje.',
    bestOptionId: 'priority-align',
    explanation: 'Alinhar prioridade com as pessoas envolvidas evita promessa impossivel e torna o prazo realista.',
    options: [
      {
        id: 'priority-align',
        text: 'Explicar o conflito de prazo e pedir orientacao sobre qual tarefa vem primeiro.',
        quality: 'best',
        basePoints: 1000,
        feedback: 'Boa decisao: voce torna o conflito visivel e busca prioridade real.',
      },
      {
        id: 'priority-pick-one',
        text: 'Escolher a tarefa que parece mais facil e entregar essa primeiro.',
        quality: 'ok',
        basePoints: 600,
        feedback: 'Pode resolver algo, mas talvez nao seja o que tem maior impacto para a equipe.',
      },
      {
        id: 'priority-say-yes',
        text: 'Dizer sim para as duas para nao desagradar ninguem.',
        quality: 'poor',
        basePoints: 0,
        feedback: 'Prometer o que nao cabe no tempo cria atraso e quebra expectativa.',
      },
    ],
  },
  {
    id: 'work-team-conflict',
    title: 'Clima na equipe',
    topic: 'Postura',
    scenario: 'Dois colegas discutem durante uma atividade e a conversa começa a atrapalhar o trabalho.',
    bestOptionId: 'team-refocus',
    explanation: 'Trazer o foco para a tarefa e escalar com respeito se necessario ajuda sem entrar no conflito.',
    options: [
      {
        id: 'team-refocus',
        text: 'Sugerir voltar ao objetivo da atividade e, se continuar, chamar alguem responsavel.',
        quality: 'best',
        basePoints: 1000,
        feedback: 'Boa decisao: voce preserva o foco e busca apoio sem aumentar a tensao.',
      },
      {
        id: 'team-ignore',
        text: 'Ignorar a discussao e continuar sua parte sozinho.',
        quality: 'ok',
        basePoints: 600,
        feedback: 'Evita entrar no conflito, mas pode deixar o problema afetar a entrega do grupo.',
      },
      {
        id: 'team-take-side',
        text: 'Tomar partido de quem voce acha que esta certo.',
        quality: 'poor',
        basePoints: 0,
        feedback: 'Tomar partido tende a aumentar o conflito e desviar ainda mais da atividade.',
      },
    ],
  },
  {
    id: 'work-confidential-info',
    title: 'Informacao sensivel',
    topic: 'Etica',
    scenario: 'Voce viu um documento com dados internos que nao parecem destinados ao seu grupo.',
    bestOptionId: 'confidential-report',
    explanation: 'Informacao sensivel deve ser tratada com cuidado e comunicada ao responsavel correto.',
    options: [
      {
        id: 'confidential-report',
        text: 'Nao compartilhar o conteudo e avisar discretamente a pessoa responsavel.',
        quality: 'best',
        basePoints: 1000,
        feedback: 'Boa decisao: protege a informacao e corrige o acesso sem espalhar o problema.',
      },
      {
        id: 'confidential-close',
        text: 'Fechar o arquivo e nao comentar com ninguem.',
        quality: 'ok',
        basePoints: 600,
        feedback: 'Evita espalhar, mas nao ajuda a corrigir o acesso indevido.',
      },
      {
        id: 'confidential-share',
        text: 'Mandar para colegas perguntando se eles tambem receberam.',
        quality: 'poor',
        basePoints: 0,
        feedback: 'Compartilhar aumenta o vazamento e pode gerar problema serio.',
      },
    ],
  },
  {
    id: 'work-customer-message',
    title: 'Mensagem ao publico',
    topic: 'Comunicacao',
    scenario: 'Um usuario manda uma mensagem irritada sobre um atendimento e voce precisa responder.',
    bestOptionId: 'customer-calm',
    explanation: 'Responder com calma, reconhecer o problema e indicar proximo passo reduz atrito.',
    options: [
      {
        id: 'customer-calm',
        text: 'Responder com respeito, reconhecer a situacao e explicar o proximo encaminhamento.',
        quality: 'best',
        basePoints: 1000,
        feedback: 'Boa decisao: acolhe a pessoa e conduz para uma solucao.',
      },
      {
        id: 'customer-template',
        text: 'Enviar uma resposta padrao curta para encerrar logo.',
        quality: 'ok',
        basePoints: 600,
        feedback: 'Pode ser rapido, mas talvez nao responda ao problema especifico.',
      },
      {
        id: 'customer-react',
        text: 'Responder no mesmo tom para mostrar que a pessoa exagerou.',
        quality: 'poor',
        basePoints: 0,
        feedback: 'Responder no mesmo tom aumenta o conflito e prejudica a imagem profissional.',
      },
    ],
  },
  {
    id: 'work-idle-moment',
    title: 'Momento sem tarefa',
    topic: 'Iniciativa',
    scenario: 'Voce terminou uma tarefa antes do previsto e ainda faltam 40 minutos para o fim do expediente.',
    bestOptionId: 'idle-ask-next',
    explanation: 'Avisar que terminou e pedir proxima prioridade mostra iniciativa e responsabilidade.',
    options: [
      {
        id: 'idle-ask-next',
        text: 'Avisar que concluiu e perguntar qual proxima prioridade pode apoiar.',
        quality: 'best',
        basePoints: 1000,
        feedback: 'Boa decisao: voce usa bem o tempo e ajuda o fluxo da equipe.',
      },
      {
        id: 'idle-review',
        text: 'Revisar sua entrega e organizar seus arquivos enquanto aguarda.',
        quality: 'ok',
        basePoints: 600,
        feedback: 'E uma atitude util, mas poderia tambem sinalizar disponibilidade.',
      },
      {
        id: 'idle-phone',
        text: 'Ficar no celular porque sua tarefa ja acabou.',
        quality: 'poor',
        basePoints: 0,
        feedback: 'Passa uma imagem ruim e perde a chance de aprender ou apoiar a equipe.',
      },
    ],
  },
  {
    id: 'work-meeting-note',
    title: 'Combinado em reuniao',
    topic: 'Organizacao',
    scenario: 'Durante uma reuniao rapida, combinam uma entrega sua para sexta-feira.',
    bestOptionId: 'meeting-confirm',
    explanation: 'Registrar e confirmar combinados evita esquecimento e reduz ambiguidade.',
    options: [
      {
        id: 'meeting-confirm',
        text: 'Anotar o combinado e confirmar prazo, formato e responsavel pela validacao.',
        quality: 'best',
        basePoints: 1000,
        feedback: 'Boa decisao: deixa claro o que sera entregue e como sera conferido.',
      },
      {
        id: 'meeting-memory',
        text: 'Guardar de memoria porque a reuniao foi curta.',
        quality: 'ok',
        basePoints: 600,
        feedback: 'Pode funcionar, mas aumenta o risco de esquecer detalhes.',
      },
      {
        id: 'meeting-ask-last-minute',
        text: 'Deixar para perguntar detalhes na sexta-feira.',
        quality: 'poor',
        basePoints: 0,
        feedback: 'Perguntar so no prazo final pode atrasar a entrega.',
      },
    ],
  },
  {
    id: 'work-learning-gap',
    title: 'Ferramenta nova',
    topic: 'Aprendizado',
    scenario: 'A equipe usa uma ferramenta que voce ainda nao domina, mas precisa entregar algo simples nela.',
    bestOptionId: 'learning-ask-resource',
    explanation: 'Combinar aprendizado rapido com apoio certo acelera a entrega sem esconder a dificuldade.',
    options: [
      {
        id: 'learning-ask-resource',
        text: 'Avisar que ainda esta aprendendo e pedir um exemplo ou material de referencia.',
        quality: 'best',
        basePoints: 1000,
        feedback: 'Boa decisao: voce assume a lacuna e busca autonomia com direcao.',
      },
      {
        id: 'learning-watch-random',
        text: 'Procurar videos aleatorios ate achar algo parecido.',
        quality: 'ok',
        basePoints: 600,
        feedback: 'Mostra iniciativa, mas pode consumir tempo sem garantir que segue o padrao da equipe.',
      },
      {
        id: 'learning-avoid',
        text: 'Dizer que nao consegue fazer porque nunca usou a ferramenta.',
        quality: 'poor',
        basePoints: 0,
        feedback: 'Bloqueia a entrega sem tentar alinhar apoio ou caminho de aprendizado.',
      },
    ],
  },
];

export const workSituationCatalog: WorkSituationCatalogEntry[] = workSituationItems.map(defineWorkSituation);

export function getWorkSituationCatalog() {
  return workSituationCatalog;
}
