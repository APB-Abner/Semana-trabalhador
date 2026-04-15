import { useState } from 'react';
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

   const calcularResultado = () => calculateProfile(respostas, vocationalResults);

   const progresso = Math.round(((etapa + 1) / vocationalQuestions.length) * 100);
   const perguntaAtual = vocationalQuestions[etapa];

   return (
      <div className="p-6 max-w-xl mx-auto bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 transition-colors duration-300">
         <h2 className="text-2xl font-bold mb-4 text-center">🧭 Teste Vocacional Interativo</h2>

         {finalizado ? (
            <div className="bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-200 p-6 rounded-lg shadow text-center animate-fade-in">
               <h3 className="text-xl font-semibold mb-2">Resultado:</h3>
               <p className="text-lg">{calcularResultado()}</p>
               <button
                  className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
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
