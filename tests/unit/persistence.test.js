it('stores the latest vocational summary with blend info', () => {
  const history = saveVocationalHistory({
    primary: { area: 'tecnologia', title: 'Tecnologia e Inovação' },
    ranking: [
      { area: 'tecnologia', title: 'Tecnologia e Inovação', percentage: 100, score: 36 },
      { area: 'exatas', title: 'Exatas e Solução de Problemas', percentage: 86, score: 31 },
      { area: 'administracao', title: 'Administração e Gestão', percentage: 74, score: 27 },
    ],
    profileBlend: ['Analítico', 'Prático'],
  });

  expect(history.primaryArea).toBe('tecnologia');
  expect(history.primaryTitle).toBe('Tecnologia e Inovação');
  expect(history.profileBlend).toEqual(['Analítico', 'Prático']);
  expect(history.ranking).toHaveLength(3);

  expect(readVocationalHistory()).toMatchObject({
    primaryArea: 'tecnologia',
    primaryTitle: 'Tecnologia e Inovação',
    profileBlend: ['Analítico', 'Prático'],
  });
});