import { vocationalQuestions } from '../content/vocational/questions.js';
import { vocationalResults } from '../content/vocational/results.ts';
import useVocationalTest from '../features/vocational-test/model/useVocationalTest.js';
import Badge from '../shared/ui/Badge.jsx';
import CtaButtonRow from '../shared/ui/CtaButtonRow.jsx';
import PageHeader from '../shared/ui/PageHeader.jsx';
import PageShell from '../shared/ui/PageShell.jsx';
import ProgressBar from '../shared/ui/ProgressBar.jsx';
import ResultPanel from '../shared/ui/ResultPanel.jsx';

export default function Testes() {
   const {
      etapa,
      canGoBack,
      finalizado,
      history,
      perguntaAtual,
      progresso,
      responder,
      respostaAtual,
      reset,
      resultado,
      totalPerguntas,
      voltar,
   } = useVocationalTest(vocationalQuestions, vocationalResults);

   const hasHistory = Boolean(history.updatedAt && history.ranking.length);

   return (
      <PageShell size="default" className="text-gray-900 dark:text-white">
         <PageHeader
            eyebrow="Orientação"
            title="Teste Vocacional Interativo"
            description="Responda uma pergunta por vez para descobrir combinações de perfil, áreas com maior afinidade e próximos passos práticos."
         />

         {finalizado ? (
            <div className="animate-fade-in">
               <ResultPanel tone="success">
                  <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                     Resultado vocacional
                  </p>

                  <div className="mt-3 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                     <div>
                        <h2 className="text-3xl font-extrabold text-gray-950 dark:text-white">
                           {resultado.primary?.title}
                        </h2>
                        <p className="mt-3 max-w-3xl text-gray-700 dark:text-gray-200">
                           {resultado.primary?.summary}
                        </p>
                        {resultado.primary?.fitSummary && (
                           <p className="mt-3 max-w-3xl text-sm text-gray-600 dark:text-gray-300">
                              {resultado.primary.fitSummary}
                           </p>
                        )}
                     </div>

                     {resultado.primary && (
                        <div className="flex flex-col items-start gap-2">
                           <Badge tone="green" className="w-fit">
                              Perfil principal: {resultado.primary.percentage}%
                           </Badge>
                           {resultado.profileBlend.length > 0 && (
                              <Badge tone="blue" className="w-fit">
                                 Combinação: {resultado.profileBlend.join(' + ')}
                              </Badge>
                           )}
                        </div>
                     )}
                  </div>
               </ResultPanel>

               <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                  <section className="space-y-4" aria-label="Ranking vocacional">
                     {resultado.ranking.map((profile, index) => (
                        <ResultPanel key={profile.area} tone="neutral">
                           <div className="flex items-center justify-between gap-4">
                              <div>
                                 <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                                    #{index + 1}
                                 </p>
                                 <h3 className="text-lg font-bold text-gray-950 dark:text-white">
                                    {profile.title}
                                 </h3>
                              </div>
                              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-300">
                                 {profile.percentage}%
                              </span>
                           </div>

                           <ProgressBar value={profile.percentage} className="mt-4 h-2" />

                           <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                              {profile.summary}
                           </p>

                           {profile.reasons?.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                 {profile.reasons.map((reason) => (
                                    <Badge key={reason} tone="gray">
                                       {reason}
                                    </Badge>
                                 ))}
                              </div>
                           )}
                        </ResultPanel>
                     ))}
                  </section>

                  <aside className="space-y-4">
                     <ResultPanel>
                        <h3 className="font-bold text-gray-950 dark:text-white">Mapa de dimensões</h3>
                        <div className="mt-4 space-y-3">
                           {resultado.dimensions.map((dimension) => (
                              <div key={dimension.id}>
                                 <div className="mb-1 flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-800 dark:text-gray-100">
                                       {dimension.label}
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-300">
                                       {dimension.percentage}%
                                    </span>
                                 </div>
                                 <ProgressBar value={dimension.percentage} className="h-2" />
                              </div>
                           ))}
                        </div>
                     </ResultPanel>

                     {resultado.primary && (
                        <>
                           <ResultPanel>
                              <h3 className="font-bold text-gray-950 dark:text-white">Pontos fortes</h3>
                              <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                                 {resultado.primary.strengths.map((item) => (
                                    <li key={item}>- {item}</li>
                                 ))}
                              </ul>
                           </ResultPanel>

                           <ResultPanel>
                              <h3 className="font-bold text-gray-950 dark:text-white">
                                 Ambientes que combinam
                              </h3>
                              <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                                 {resultado.primary.environments.map((item) => (
                                    <li key={item}>- {item}</li>
                                 ))}
                              </ul>
                           </ResultPanel>

                           <ResultPanel>
                              <h3 className="font-bold text-gray-950 dark:text-white">
                                 Estilo de trabalho mais compatível
                              </h3>
                              <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                                 {resultado.primary.idealWorkStyles.map((item) => (
                                    <li key={item}>- {item}</li>
                                 ))}
                              </ul>
                           </ResultPanel>

                           <ResultPanel>
                              <h3 className="font-bold text-gray-950 dark:text-white">Próximos passos</h3>
                              <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                                 {resultado.primary.suggestedActions.map((item) => (
                                    <li key={item}>- {item}</li>
                                 ))}
                              </ul>
                           </ResultPanel>

                           <ResultPanel>
                              <h3 className="font-bold text-gray-950 dark:text-white">Áreas relacionadas</h3>
                              <div className="mt-3 flex flex-wrap gap-2">
                                 {resultado.primary.relatedAreas.map((area) => (
                                    <Badge key={area} tone="blue">
                                       {area}
                                    </Badge>
                                 ))}
                              </div>
                           </ResultPanel>

                           <ResultPanel tone="info">
                              <p className="text-sm text-blue-900 dark:text-blue-100">
                                 Este resultado não define sua carreira. Ele funciona como um mapa inicial
                                 para explorar ambientes, rotinas e áreas com maior chance de encaixe.
                              </p>
                           </ResultPanel>
                        </>
                     )}
                  </aside>
               </div>

               <CtaButtonRow
                  className="mt-8 justify-start"
                  actions={[
                     ...(resultado.primary?.nextStep
                        ? [
                           {
                              label: resultado.primary.nextStep.label,
                              href: resultado.primary.nextStep.href,
                              tone: 'green',
                           },
                        ]
                        : []),
                     { label: 'Ver mapa', href: '/mapa', tone: 'blue' },
                     { label: 'Ir para o game', href: '/game', tone: 'purple' },
                     { label: 'Refazer', onClick: reset, tone: 'gray' },
                  ]}
               />
            </div>
         ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
               <ResultPanel className="animate-fade-in">
                  <div>
                     <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>
                           Pergunta {etapa + 1} de {totalPerguntas}
                        </span>
                        <span>{progresso}%</span>
                     </div>
                     <ProgressBar value={progresso} className="h-2" />
                  </div>

                  <h2 className="mt-6 text-2xl font-bold text-gray-950 dark:text-white">
                     {perguntaAtual.texto}
                  </h2>

                  {perguntaAtual.contexto && (
                     <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                        {perguntaAtual.contexto}
                     </p>
                  )}

                  <div className="mt-5 grid gap-3">
                     {perguntaAtual.opcoes.map((opcao) => {
                        const isSelected = respostaAtual?.id === opcao.id;

                        return (
                           <button
                              key={opcao.id}
                              type="button"
                              onClick={() => responder(opcao)}
                              aria-pressed={isSelected}
                              className={`block w-full rounded-lg border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${isSelected
                                    ? 'border-blue-400 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-100'
                                    : 'border-gray-200 bg-white text-gray-800 hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-100 dark:hover:border-blue-600 dark:hover:bg-blue-950'
                                 }`}
                           >
                              {opcao.texto}
                           </button>
                        );
                     })}
                  </div>

                  <CtaButtonRow
                     className="mt-6 justify-start"
                     actions={[
                        ...(canGoBack
                           ? [{ label: 'Voltar', onClick: voltar, tone: 'gray' }]
                           : []),
                     ]}
                  />
               </ResultPanel>

               <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
                  <ResultPanel tone="info">
                     <h2 className="font-bold text-gray-950 dark:text-white">Como funciona</h2>
                     <p className="mt-2 text-sm text-blue-900 dark:text-blue-100">
                        Em vez de tentar te encaixar em uma única profissão, o teste observa padrões de
                        interesse, rotina e estilo de trabalho para sugerir áreas com maior afinidade.
                     </p>
                  </ResultPanel>

                  <ResultPanel>
                     <h2 className="font-bold text-gray-950 dark:text-white">O que considerar</h2>
                     <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                        <li>- Responda pelo que parece natural para você hoje.</li>
                        <li>- Não existe “resposta melhor”.</li>
                        <li>- O resultado é uma orientação inicial, não um diagnóstico fechado.</li>
                     </ul>
                  </ResultPanel>

                  {hasHistory && (
                     <ResultPanel>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                           Último perfil salvo
                        </p>

                        {history.primaryTitle && (
                           <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                              Perfil principal: {history.primaryTitle}
                           </p>
                        )}

                        {history.profileBlend?.length > 0 && (
                           <div className="mt-3 flex flex-wrap gap-2">
                              {history.profileBlend.map((item) => (
                                 <Badge key={item} tone="blue">
                                    {item}
                                 </Badge>
                              ))}
                           </div>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                           {history.ranking.map((profile, index) => (
                              <Badge key={profile.area} tone={index === 0 ? 'blue' : 'gray'}>
                                 #{index + 1} {profile.title} - {profile.percentage}%
                              </Badge>
                           ))}
                        </div>
                     </ResultPanel>
                  )}
               </aside>
            </div>
         )}
      </PageShell>
   );
}