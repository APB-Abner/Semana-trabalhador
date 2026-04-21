import { Link } from 'react-router-dom';
import CtaButtonRow from '../shared/ui/CtaButtonRow.jsx';
import PageHeader from '../shared/ui/PageHeader.jsx';
import PageShell from '../shared/ui/PageShell.jsx';
import ResultPanel from '../shared/ui/ResultPanel.jsx';

export default function Competicao() {
  return (
    <PageShell size="default" className="text-gray-900 dark:text-white">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <PageHeader
            eyebrow="Competição online"
            title="Competição Jovem Trabalhador"
            description="Crie uma sala, compartilhe o PIN e conduza uma partida com 3 desafios rápidos."
            className="mb-0"
            actions={(
              <CtaButtonRow
                className="justify-start"
                actions={[
                  { label: 'Criar sala como host', href: '/competicao/host', tone: 'green' },
                  { label: 'Entrar com PIN', href: '/competicao/entrar', tone: 'blue' },
                ]}
              />
            )}
          />
        </div>

        <ResultPanel tone="info">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fluxo da partida</h2>
          <ol className="mt-4 space-y-3 text-sm text-blue-900 dark:text-blue-100">
            <li>1. Host cria uma sala e recebe um PIN de 6 dígitos.</li>
            <li>2. Jogadores entram com nome e PIN.</li>
            <li>3. O host libera as rodadas no ritmo da turma.</li>
            <li>4. O placar acumula até o pódio final.</li>
          </ol>
        </ResultPanel>
      </section>

      <div className="mt-10 text-sm text-gray-600 dark:text-gray-400">
        <Link to="/game" className="font-semibold text-blue-600 hover:underline dark:text-blue-300">
          O modo solo continua disponível.
        </Link>
      </div>
    </PageShell>
  );
}
