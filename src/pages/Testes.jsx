// --- pages/Testes.jsx ---
import { useState } from 'react';

const perguntas = [
   {
      texto: 'Você se sente mais realizado quando está:',
      opcoes: [
         { texto: '🩺 Ajudando pessoas diretamente', areas: ['saude'] },
         { texto: '🎨 Criando algo novo ou artístico', areas: ['artes'] },
         { texto: '🧠 Resolvendo problemas com lógica', areas: ['exatas'] },
         { texto: '📅 Organizando tarefas e planejando', areas: ['administracao'] },
      ],
   },
   {
      texto: 'No seu tempo livre, você prefere:',
      opcoes: [
         { texto: '🤖 Fazer experiências ou explorar tecnologia', areas: ['tecnologia'] },
         { texto: '✍️ Desenhar, escrever ou compor', areas: ['artes'] },
         { texto: '🗣️ Conversar, debater, ensinar', areas: ['comunicacao'] },
         { texto: '💆‍♂️ Ler sobre saúde e bem-estar', areas: ['saude'] },
      ],
   },
   {
      texto: 'Qual dessas situações te parece mais interessante?',
      opcoes: [
         { texto: '📱 Criar um aplicativo ou jogo', areas: ['tecnologia'] },
         { texto: '📋 Administrar um evento com muitas pessoas', areas: ['administracao'] },
         { texto: '🎭 Atuar em uma peça de teatro', areas: ['artes'] },
         { texto: '🤝 Ajudar alguém a superar um problema', areas: ['saude'] },
      ],
   },
   {
      texto: 'Se tivesse que escolher uma aula extra, qual seria?',
      opcoes: [
         { texto: '📐 Matemática avançada', areas: ['exatas'] },
         { texto: '🎤 Comunicação e oratória', areas: ['comunicacao'] },
         { texto: '🧬 Programação e robótica', areas: ['tecnologia'] },
         { texto: '🚑 Primeiros socorros', areas: ['saude'] },
      ],
   },
   {
      texto: 'Qual dessas qualidades você mais se identifica?',
      opcoes: [
         { texto: '🌈 Criatividade e imaginação', areas: ['artes'] },
         { texto: '💗 Empatia e cuidado', areas: ['saude'] },
         { texto: '📂 Organização e disciplina', areas: ['administracao'] },
         { texto: '🧮 Raciocínio lógico', areas: ['exatas'] },
      ],
   },
   {
      texto: 'Se pudesse escolher um projeto para liderar, seria:',
      opcoes: [
         { texto: '🖼️ Uma exposição artística', areas: ['artes'] },
         { texto: '🔬 Uma feira de ciência', areas: ['exatas', 'tecnologia'] },
         { texto: '📢 Uma campanha de conscientização', areas: ['comunicacao'] },
         { texto: '🏢 Um plano de negócios para jovens', areas: ['administracao'] },
      ],
   },
];

const resultados = {
   saude: '🩺 Você tem vocação para a área da Saúde! Seu perfil é cuidador, empático e voltado para o bem-estar das pessoas.',
   artes: '🎨 Você é altamente criativo! Sua vocação está nas Artes, Design ou Produção Cultural.',
   exatas: '📐 Seu raciocínio lógico é forte! A área de Exatas pode ser ideal para você: engenharia, matemática, física.',
   administracao: '📊 Você tem perfil de liderança e gestão! Administração, RH ou Logística combinam com você.',
   tecnologia: '💻 Você ama inovação! A área de Tecnologia da Informação ou Engenharia de Software pode ser o seu caminho.',
   comunicacao: '🗣️ Comunicação é sua força! Você pode se destacar em Jornalismo, Publicidade ou Educação.',
};

export default function Testes() {
   const [etapa, setEtapa] = useState(0);
   const [respostas, setRespostas] = useState([]);
   const [finalizado, setFinalizado] = useState(false);

   const responder = (areas) => {
      setRespostas([...respostas, ...areas]);
      if (etapa + 1 < perguntas.length) {
         setEtapa(etapa + 1);
      } else {
         setFinalizado(true);
      }
   };

   const calcularResultado = () => {
      const contagem = {};
      respostas.forEach((area) => {
         contagem[area] = (contagem[area] || 0) + 1;
      });
      const areaMaisFrequente = Object.keys(contagem).reduce((a, b) =>
         contagem[a] > contagem[b] ? a : b
      );
      return resultados[areaMaisFrequente];
   };

   const progresso = Math.round(((etapa + 1) / perguntas.length) * 100);

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
                     <span>Pergunta {etapa + 1} de {perguntas.length}</span>
                     <span>{progresso}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-zinc-600 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 dark:bg-blue-400 transition-all" style={{ width: `${progresso}%` }}></div>
                  </div>
               </div>

               {/* Pergunta e opções */}
               <p className="text-lg font-medium mb-4">{perguntas[etapa].texto}</p>
               <div className="space-y-3">
                  {perguntas[etapa].opcoes.map((opcao, idx) => (
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
