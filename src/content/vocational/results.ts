import type { VocationalProfile } from '../../shared/types/learning';

export const vocationalResults: Record<string, VocationalProfile> = {
  saude: {
    title: 'Saúde e Cuidado',
    summary: 'Você demonstra empatia, atenção às pessoas e interesse por bem-estar.',
    strengths: ['Escuta ativa', 'Responsabilidade', 'Cuidado com detalhes'],
    environments: ['Clínicas', 'Projetos sociais', 'Atendimento ao público'],
    relatedAreas: ['Enfermagem', 'Psicologia', 'Educação física', 'Técnico em saúde'],
    nextStep: { label: 'Ver dicas de comportamento profissional', href: '/dicas' },
  },
  artes: {
    title: 'Artes, Design e Criação',
    summary: 'Seu perfil valoriza expressão, imaginação e construção de ideias novas.',
    strengths: ['Criatividade', 'Comunicação visual', 'Sensibilidade estética'],
    environments: ['Estúdios criativos', 'Produção cultural', 'Marketing e conteúdo'],
    relatedAreas: ['Design', 'Audiovisual', 'Moda', 'Produção cultural'],
    nextStep: { label: 'Praticar com o desafio final', href: '/game' },
  },
  exatas: {
    title: 'Exatas e Solução de Problemas',
    summary: 'Você tende a gostar de lógica, precisão e desafios com resposta estruturada.',
    strengths: ['Raciocínio lógico', 'Organização mental', 'Análise de dados'],
    environments: ['Laboratórios', 'Áreas técnicas', 'Times de planejamento'],
    relatedAreas: ['Engenharia', 'Matemática', 'Finanças', 'Ciência de dados'],
    nextStep: { label: 'Encontrar unidades próximas', href: '/mapa' },
  },
  administracao: {
    title: 'Administração e Gestão',
    summary: 'Você se identifica com organização, planejamento e coordenação de tarefas.',
    strengths: ['Planejamento', 'Disciplina', 'Visão de processo'],
    environments: ['Escritórios', 'RH', 'Logística e atendimento interno'],
    relatedAreas: ['Administração', 'Recursos humanos', 'Logística', 'Gestão comercial'],
    nextStep: { label: 'Ver dicas para iniciar a carreira', href: '/dicas' },
  },
  tecnologia: {
    title: 'Tecnologia e Inovação',
    summary: 'Você demonstra curiosidade por ferramentas, automação e criação de soluções digitais.',
    strengths: ['Aprendizado contínuo', 'Lógica aplicada', 'Experimentação'],
    environments: ['Times de produto', 'Suporte técnico', 'Desenvolvimento de sistemas'],
    relatedAreas: ['Programação', 'Suporte técnico', 'Robótica', 'Análise de sistemas'],
    nextStep: { label: 'Testar conhecimentos no game', href: '/game' },
  },
  comunicacao: {
    title: 'Comunicação e Relações',
    summary: 'Você tem facilidade para trocar ideias, explicar assuntos e conectar pessoas.',
    strengths: ['Oratória', 'Clareza', 'Mediação de conversas'],
    environments: ['Atendimento', 'Educação', 'Comunicação interna e externa'],
    relatedAreas: ['Jornalismo', 'Publicidade', 'Educação', 'Eventos'],
    nextStep: { label: 'Ver oportunidades próximas', href: '/mapa' },
  },
};
