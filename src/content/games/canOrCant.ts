export type CanOrCantAnswer = 'can' | 'cant';

export type CanOrCantItem = {
  id: string;
  topic: string;
  title: string;
  situation: string;
  answer: CanOrCantAnswer;
  explanation: string;
};

export const canOrCantItems: CanOrCantItem[] = [
  {
    id: 'can-phone-break',
    topic: 'Rotina',
    title: 'Celular no intervalo',
    situation: 'Usar o celular durante o intervalo, sem atrapalhar o retorno ao trabalho.',
    answer: 'can',
    explanation: 'No intervalo, o uso é aceitável quando respeita as regras do local e não atrasa a volta às atividades.',
  },
  {
    id: 'cant-ignore-delay',
    topic: 'Pontualidade',
    title: 'Atraso sem aviso',
    situation: 'Perceber que vai atrasar e deixar para explicar só quando chegar.',
    answer: 'cant',
    explanation: 'O correto é avisar o quanto antes, com objetividade, para a equipe se organizar.',
  },
  {
    id: 'can-ask-help',
    topic: 'Aprendizagem',
    title: 'Pedir orientação',
    situation: 'Pedir ajuda quando uma tarefa nova não ficou clara.',
    answer: 'can',
    explanation: 'Pedir orientação evita erro repetido e mostra responsabilidade com a entrega.',
  },
  {
    id: 'cant-share-password',
    topic: 'Segurança',
    title: 'Senha compartilhada',
    situation: 'Passar sua senha para um colega acessar o sistema mais rápido.',
    answer: 'cant',
    explanation: 'Senha é pessoal. Compartilhar acesso gera risco de segurança e responsabilidade indevida.',
  },
  {
    id: 'can-note-feedback',
    topic: 'Feedback',
    title: 'Anotar feedback',
    situation: 'Anotar pontos de melhoria depois de receber orientação do líder.',
    answer: 'can',
    explanation: 'Registrar feedback ajuda a transformar a conversa em ação prática.',
  },
  {
    id: 'cant-joke-group',
    topic: 'Convivência',
    title: 'Piada no grupo',
    situation: 'Fazer piada sobre um colega no grupo da equipe.',
    answer: 'cant',
    explanation: 'Brincadeiras que expõem alguém podem virar desrespeito e prejudicar o clima da equipe.',
  },
  {
    id: 'can-confirm-deadline',
    topic: 'Organização',
    title: 'Confirmar prazo',
    situation: 'Confirmar o prazo de uma tarefa antes de começar.',
    answer: 'can',
    explanation: 'Confirmar prazo reduz retrabalho e ajuda a priorizar o que precisa sair primeiro.',
  },
  {
    id: 'cant-post-uniform',
    topic: 'Imagem profissional',
    title: 'Postagem indevida',
    situation: 'Postar vídeo usando uniforme e mostrando área interna da empresa sem autorização.',
    answer: 'cant',
    explanation: 'Ambientes e informações da empresa podem ser restritos. Antes de postar, é preciso autorização.',
  },
  {
    id: 'can-report-risk',
    topic: 'Segurança',
    title: 'Avisar risco',
    situation: 'Avisar um responsável ao notar cabo solto ou área escorregadia.',
    answer: 'can',
    explanation: 'Comunicar riscos protege você, colegas e visitantes.',
  },
  {
    id: 'cant-hide-error',
    topic: 'Responsabilidade',
    title: 'Erro escondido',
    situation: 'Perceber um erro em uma planilha e torcer para ninguém notar.',
    answer: 'cant',
    explanation: 'Erro comunicado cedo costuma ser mais fácil de corrigir e evita impacto maior.',
  },
  {
    id: 'can-use-calendar',
    topic: 'Organização',
    title: 'Agenda de tarefas',
    situation: 'Usar agenda ou checklist para acompanhar entregas da semana.',
    answer: 'can',
    explanation: 'Ferramentas simples de organização ajudam a cumprir prazos e reduzem esquecimentos.',
  },
  {
    id: 'cant-interrupt-client',
    topic: 'Comunicação',
    title: 'Interromper atendimento',
    situation: 'Interromper um cliente ou colega no meio da fala para acelerar a conversa.',
    answer: 'cant',
    explanation: 'Ouvir primeiro melhora a resposta e demonstra respeito profissional.',
  },
  {
    id: 'can-keep-documents',
    topic: 'Documentos',
    title: 'Documentos em dia',
    situation: 'Manter documentos pessoais e comprovantes organizados para quando a empresa solicitar.',
    answer: 'can',
    explanation: 'Organização documental evita atrasos em processos internos e oportunidades.',
  },
  {
    id: 'cant-skip-training',
    topic: 'Desenvolvimento',
    title: 'Treinamento ignorado',
    situation: 'Faltar ao treinamento obrigatório porque acha que já sabe o conteúdo.',
    answer: 'cant',
    explanation: 'Treinamento obrigatório faz parte da rotina profissional e garante alinhamento mínimo.',
  },
  {
    id: 'can-say-no-risky-task',
    topic: 'Segurança',
    title: 'Limite seguro',
    situation: 'Avisar que não pode executar uma atividade insegura ou fora da orientação recebida.',
    answer: 'can',
    explanation: 'Reconhecer limites e pedir validação é mais profissional do que improvisar em situação de risco.',
  },
  {
    id: 'cant-use-slang-email',
    topic: 'Comunicação',
    title: 'E-mail informal',
    situation: 'Enviar e-mail para liderança com gírias, abreviações e sem assunto claro.',
    answer: 'cant',
    explanation: 'E-mail profissional precisa ser claro, respeitoso e fácil de entender.',
  },
];
