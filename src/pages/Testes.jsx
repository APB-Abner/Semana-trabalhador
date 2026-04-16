import { useState } from 'react';
import { Link } from 'react-router-dom';
import { vocationalQuestions } from '../content/vocational/questions.js';
import { vocationalResults } from '../content/vocational/results.js';
import calculateProfile from '../features/vocational-test/lib/calculateProfile.js';

export default function Testes() {
   const [etapa, setEtapa] = useState(0);
   const [respostas, setRespostas] = useState([]);
   const [finalizado, setFinalizado] = useState(false);

   const responder = (areas) => {
      setRespostas([...respostas, ...areas]);
      if (etapa + 1 < vocationalQuestions.length) {
         setEtapa(etapa + 1);
      } else {
         setFinalizado(true);
      }
   };

   const resultado = calculateProfile(respostas, vocationalResults);

   const progresso = Math.round(((etapa + 1) / vocationalQuestions.length) * 100);
   const perguntaAtual = vocationalQuestions[etapa];

   return (
      <div className="p-6 max-w-xl mx-auto bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 transition-colors duration-300">
         <h2 className="text-2xl font-bold mb-4 text-center">🧭 Teste Vocacional Interativo</h2>

         {finalizado ? (
            <div className="bg-green-50 dark:bg-zinc-700 text-green-900 dark:text-green-100 p-6 rounded-lg shadow animate-fade-in">
               <div className="text-center">
                  <p className="text-sm uppercase tracking-wide text-green-700 dark:text-green-300">Resultado vocacional</p>
                  <h3 className="mt-2 text-2xl font-bold">{resultado.primary?.title}</h3>
                  <p className="mt-2 text-gray-700 dark:text-gray-200">{resultado.primary?.summary}</p>
               </div>

               <div className="mt-6 space-y-4">
                  {resultado.ranking.map((profile, index) => (
                     <div key={profile.area} className="rounded border border-green-200 bg-white p-4 dark:border-zinc-600 dark:bg-zinc-800">
                        <div className="flex items-center justify-between gap-4">
                           <div>
                              <p className="text-sm font-semibold text-green-700 dark:text-green-300">#{index + 1}</p>
                              <h4 className="font-bold text-gray-900 dark:text-white">{profile.title}</h4>
                           </div>
                           <span className="text-lg font-bold text-blue-600 dark:text-blue-300">{profile.percentage}%</span>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded bg-gray-200 dark:bg-zinc-700">
                           <div className="h-full bg-blue-500 transition-all" style={{ width: `${profile.percentage}%` }} />
                        </div>
                     </div>
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
                        <h4 className="font-semibold text-gray-900 dark:text-white">Áreas relacionadas</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                           {resultado.primary.relatedAreas.map((area) => (
                              <span key={area} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                                 {area}
                              </span>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {resultado.primary?.nextStep && (
                     <Link
                        to={resultado.primary.nextStep.href}
                        className="rounded bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700"
                     >
                        {resultado.primary.nextStep.label}
                     </Link>
                  )}
                  <Link to="/mapa" className="rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700">
                     Ver mapa
                  </Link>
                  <Link to="/game" className="rounded bg-purple-600 px-4 py-2 font-semibold text-white transition hover:bg-purple-700">
                     Ir para o game
                  </Link>
               </div>

               <button
                  className="mx-auto mt-6 block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  onClick={() => {
                     setEtapa(0);
                     setRespostas([]);
                     setFinalizado(false);
                  }}
               >
                  Refazer Teste
               </button>
            </div>
         ) : (
            <div className="bg-white dark:bg-zinc-700 p-6 rounded-lg shadow animate-fade-in">
               {/* Progresso visual */}
               <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                     <span>Pergunta {etapa + 1} de {vocationalQuestions.length}</span>
                     <span>{progresso}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-zinc-600 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 dark:bg-blue-400 transition-all" style={{ width: `${progresso}%` }}></div>
                  </div>
               </div>

               {/* Pergunta e opções */}
               <p className="text-lg font-medium mb-4">{perguntaAtual.texto}</p>
               <div className="space-y-3">
                  {perguntaAtual.opcoes.map((opcao, idx) => (
                     <button
                        key={idx}
                        onClick={() => responder(opcao.areas)}
                        className="block w-full text-left px-4 py-3 bg-blue-100 dark:bg-zinc-600 rounded-lg hover:bg-blue-200 dark:hover:bg-zinc-500 transition-all"
                     >
                        {opcao.texto}
                     </button>
                  ))}
               </div>
            </div>
         )}
      </div>
   );

}
