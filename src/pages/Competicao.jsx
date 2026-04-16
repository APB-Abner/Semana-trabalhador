import { Link } from 'react-router-dom';
import Badge from '../shared/ui/Badge.jsx';
import CtaButtonRow from '../shared/ui/CtaButtonRow.jsx';
import ResultPanel from '../shared/ui/ResultPanel.jsx';

export default function Competicao() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 text-gray-900 dark:text-white">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <Badge tone="blue">Socket.IO ao vivo</Badge>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
            Competição Jovem Trabalhador
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Crie uma sala, compartilhe o PIN e conduza um quiz sincronizado com pontuação por acerto e velocidade.
          </p>
          <CtaButtonRow
            className="mt-8 justify-start"
            actions={[
              { label: 'Criar sala como host', href: '/competicao/host', tone: 'green' },
              { label: 'Entrar com PIN', href: '/competicao/entrar', tone: 'blue' },
            ]}
          />
        </div>

        <ResultPanel tone="info">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fluxo da partida</h2>
          <ol className="mt-4 space-y-3 text-sm text-blue-900 dark:text-blue-100">
            <li>1. Host cria uma sala e recebe um PIN de 6 dígitos.</li>
            <li>2. Jogadores entram com nome e PIN.</li>
            <li>3. O host inicia, cada rodada abre por tempo limitado.</li>
            <li>4. O servidor calcula leaderboard e ranking final.</li>
          </ol>
        </ResultPanel>
      </section>

      <div className="mt-10 text-sm text-gray-600 dark:text-gray-400">
        <Link to="/game" className="font-semibold text-blue-600 hover:underline dark:text-blue-300">
          O modo clássico continua disponível.
        </Link>
      </div>
    </div>
  );
}
