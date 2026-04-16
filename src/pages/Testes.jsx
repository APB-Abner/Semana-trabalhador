import { vocationalQuestions } from '../content/vocational/questions.js';
import { vocationalResults } from '../content/vocational/results.ts';
import useVocationalTest from '../features/vocational-test/model/useVocationalTest.js';
import Badge from '../shared/ui/Badge.jsx';
import CtaButtonRow from '../shared/ui/CtaButtonRow.jsx';
import ProgressBar from '../shared/ui/ProgressBar.jsx';
import ResultPanel from '../shared/ui/ResultPanel.jsx';

export default function Testes() {
   const {
      etapa,
      finalizado,
      history,
      perguntaAtual,
      progresso,
      responder,
      reset,
      resultado,
      totalPerguntas,
   } = useVocationalTest(vocationalQuestions, vocationalResults);

   return (
      <div className="p-6 max-w-xl mx-auto bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 transition-colors duration-300">
         <h2 className="text-2xl font-bold mb-4 text-center">ðŸ§­ Teste Vocacional Interativo</h2>

         {history.updatedAt && !finalizado && (
            <ResultPanel tone="info" className="mb-4">
               <p className="text-sm font-semibold text-blue-700 dark:text-blue-200">Seu Ãºltimo perfil</p>
               <div className="mt-2 flex flex-wrap gap-2">
                  {history.ranking.map((profile, index) => (
                     <Badge key={profile.area} tone={index === 0 ? 'blue' : 'gray'}>
                        #{index + 1} {profile.title} Â· {profile.percentage}%
                     </Badge>
                  ))}
               </div>
            </ResultPanel>
         )}

         {finalizado ? (
            <div className="animate-fade-in text-green-900 dark:text-green-100">
                  <div className="text-center">
                     <p className="text-sm uppercase tracking-wide text-green-700 dark:text-green-300">Resultado vocacional</p>
                     <h3 className="mt-2 text-2xl font-bold">{resultado.primary?.title}</h3>
                     <p className="mt-2 text-gray-700 dark:text-gray-200">{resultado.primary?.summary}</p>
                  </div>

                  <div className="mt-6 space-y-4">
                     {resultado.ranking.map((profile, index) => (
                        <ResultPanel key={profile.area} tone="neutral">
                           <div className="flex items-center justify-between gap-4">
                              <div>
                                 <p className="text-sm font-semibold text-green-700 dark:text-green-300">#{index + 1}</p>
                                 <h4 className="font-bold text-gray-900 dark:text-white">{profile.title}</h4>
                              </div>
                              <span className="text-lg font-bold text-blue-600 dark:text-blue-300">{profile.percentage}%</span>
                           </div>
                           <ProgressBar value={profile.percentage} className="mt-3 h-2" />
                        </ResultPanel>
                     ))}
                  </div>

                  {resultado.primary && (
                     <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
                        <div>
                           <h4 className="font-semibold text-gray-900 dark:text-white">Pontos fortes</h4>
                           <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-200">
                              {resultado.primary.strengths.map((item) => <li key={item}>{item}</li>)}
                           </ul>
                        </div>
                        <div>
                           <h4 className="font-semibold text-gray-900 dark:text-white">Ambientes que combinam</h4>
                           <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-200">
                              {resultado.primary.environments.map((item) => <li key={item}>{item}</li>)}
                           </ul>
                        </div>
                        <div className="sm:col-span-2">
                           <h4 className="font-semibold text-gray-900 dark:text-white">Ãreas relacionadas</h4>
                           <div className="mt-2 flex flex-wrap gap-2">
                              {resultado.primary.relatedAreas.map((area) => (
                                 <Badge key={area} tone="blue">{area}</Badge>
                              ))}
                           </div>
                        </div>
                     </div>
                  )}

               <CtaButtonRow
                  className="mt-6"
                  actions={[
                     ...(resultado.primary?.nextStep ? [{
                        label: resultado.primary.nextStep.label,
                        href: resultado.primary.nextStep.href,
                        tone: 'green',
                     }] : []),
                     { label: 'Ver mapa', href: '/mapa', tone: 'blue' },
                     { label: 'Ir para o game', href: '/game', tone: 'purple' },
                     { label: 'Refazer Teste', onClick: reset, tone: 'gray' },
                  ]}
               />
            </div>
         ) : (
            <ResultPanel className="animate-fade-in">
               <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                     <span>Pergunta {etapa + 1} de {totalPerguntas}</span>
                     <span>{progresso}%</span>
                  </div>
                  <ProgressBar value={progresso} className="h-2" />
               </div>

               <p className="text-lg font-medium mb-4">{perguntaAtual.texto}</p>
               <div className="space-y-3">
                  {perguntaAtual.opcoes.map((opcao, idx) => (
                     <button
                        key={idx}
                        type="button"
                        onClick={() => responder(opcao.areas)}
                        className="block w-full rounded-lg bg-blue-100 px-4 py-3 text-left transition-all hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:bg-zinc-600 dark:hover:bg-zinc-500 dark:focus:ring-offset-zinc-800"
                     >
                        {opcao.texto}
                     </button>
                  ))}
               </div>
            </ResultPanel>
         )}
      </div>
   );
}
