import { spawn } from 'node:child_process';
import process from 'node:process';
import { expect, test } from '@playwright/test';

const liveServerUrl = 'http://127.0.0.1:4177';

let serverProcess;

async function isHealthy() {
  try {
    const response = await fetch(`${liveServerUrl}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForHealth() {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    if (await isHealthy()) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error('Live quiz backend did not start for E2E tests.');
}

async function answerFirstOption(page) {
  await page.locator('main button[aria-pressed]').first().click();
  await expect(page.locator('main').getByText(/Resposta enviada|Resposta correta/).first()).toBeVisible();
}

async function nextRound(hostPage) {
  await hostPage.getByRole('button', { name: /xima rodada|Finalizar/ }).click();
}

test.beforeAll(async () => {
  if (await isHealthy()) {
    return;
  }

  serverProcess = spawn(process.execPath, ['node_modules/tsx/dist/cli.mjs', 'server/src/index.ts'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: '4177',
      CLIENT_ORIGIN: 'http://127.0.0.1:5173',
      LIVE_QUIZ_ROUND_MS: '10000',
    },
    stdio: 'ignore',
  });

  await waitForHealth();
});

test.afterAll(() => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

test('live competition supports competitive and participatory UI flows', async ({ browser }) => {
  const context = await browser.newContext();
  const host = await context.newPage();
  const ana = await context.newPage();
  const bia = await context.newPage();

  await host.goto('/competicao/host');
  await host.getByRole('button', { name: 'Criar sala' }).click();
  await expect(host).toHaveURL(/\/competicao\/host\/\d{6}$/);
  const pin = host.url().split('/').pop();

  for (const [page, name] of [[ana, 'Ana'], [bia, 'Bia']]) {
    await page.goto('/competicao/entrar');
    await page.getByLabel('Nome').fill(name);
    await page.getByLabel('PIN da sala').fill(pin);
    await page.getByRole('button', { name: 'Entrar na sala' }).click();
    await expect(page.getByText(/Aguardando o host iniciar/)).toBeVisible();
  }

  await expect(host.locator('main').getByText('Ana', { exact: true })).toBeVisible();
  await expect(host.locator('main').getByText('Bia', { exact: true })).toBeVisible();

  await host.getByRole('button', { name: 'Iniciar partida' }).click();
  await expect(ana.getByRole('heading', { level: 3 })).toBeVisible();
  await answerFirstOption(ana);
  await answerFirstOption(bia);
  await expect(host.getByText('Leaderboard da rodada')).toBeVisible();

  await nextRound(host);
  await expect(ana.getByRole('button', { name: /Verdadeiro/ })).toBeVisible();
  await ana.getByRole('button', { name: /Verdadeiro/ }).click();
  await bia.getByRole('button', { name: /Verdadeiro/ }).click();
  await expect(host.getByText('Leaderboard da rodada')).toBeVisible();

  await nextRound(host);
  await expect(ana.getByText('Múltipla seleção')).toBeVisible();
  await ana.locator('main button[aria-pressed]').nth(0).click();
  await ana.locator('main button[aria-pressed]').nth(1).click();
  await ana.locator('main button[aria-pressed]').nth(2).click();
  await ana.getByRole('button', { name: 'Confirmar resposta' }).click();

  await expect(ana.getByText(/Resposta enviada/)).toBeVisible();
  await expect(ana.getByRole('button', { name: 'Confirmar resposta' })).toBeDisabled();
  await expect(ana.locator('main button[aria-pressed]').first()).toBeDisabled();

  await bia.locator('main button[aria-pressed]').first().click();
  await bia.getByRole('button', { name: 'Confirmar resposta' }).click();

  await expect(ana.getByText(/Respostas corretas:/)).toBeVisible();
  await expect(host.getByText('Leaderboard da rodada')).toBeVisible();

  await nextRound(host);
  await expect(ana.getByText('Enquete').first()).toBeVisible();
  await ana.locator('main button[aria-pressed]').first().click();
  await bia.locator('main button[aria-pressed]').nth(1).click();
  await expect(host.getByText('Resultado da enquete')).toBeVisible();
  await expect(ana.getByText(/1 voto/).first()).toBeVisible();

  await nextRound(host);
  await expect(ana.getByText('Escala').first()).toBeVisible();
  await ana.getByRole('button', { name: '4' }).click();
  await ana.getByRole('button', { name: 'Confirmar resposta' }).click();
  await bia.getByRole('button', { name: '2' }).click();
  await bia.getByRole('button', { name: 'Confirmar resposta' }).click();
  await expect(host.getByText('Resultado da escala')).toBeVisible();
  await expect(ana.getByText(/M.dia do grupo/)).toBeVisible();

  await nextRound(host);
  await expect(ana.getByText('Ranking').first()).toBeVisible();
  await ana.getByRole('button', { name: 'Confirmar ranking' }).click();
  await bia.getByRole('button', { name: 'Confirmar ranking' }).click();
  await expect(host.getByText('Ranking coletivo')).toBeVisible();

  await nextRound(host);
  await expect(ana.getByText(/M.ltipla escolha/).first()).toBeVisible();
  await answerFirstOption(ana);
  await answerFirstOption(bia);
  await expect(host.getByText('Leaderboard da rodada')).toBeVisible();

  await nextRound(host);
  await expect(ana.getByText(/M.ltipla sele..o/)).toBeVisible();
  await ana.locator('main button[aria-pressed]').nth(0).click();
  await ana.locator('main button[aria-pressed]').nth(1).click();
  await ana.locator('main button[aria-pressed]').nth(2).click();
  await ana.getByRole('button', { name: 'Confirmar resposta' }).click();
  await bia.locator('main button[aria-pressed]').first().click();
  await bia.getByRole('button', { name: 'Confirmar resposta' }).click();
  await expect(host.getByText('Leaderboard da rodada')).toBeVisible();

  await nextRound(host);
  await expect(ana.getByText('Enquete').first()).toBeVisible();
  await ana.locator('main button[aria-pressed]').first().click();
  await bia.locator('main button[aria-pressed]').nth(1).click();
  await expect(host.getByText('Resultado da enquete')).toBeVisible();

  await nextRound(host);
  await expect(ana.getByText('Escala').first()).toBeVisible();
  await ana.getByRole('button', { name: '5' }).click();
  await ana.getByRole('button', { name: 'Confirmar resposta' }).click();
  await bia.getByRole('button', { name: '3' }).click();
  await bia.getByRole('button', { name: 'Confirmar resposta' }).click();
  await expect(host.getByText('Resultado da escala')).toBeVisible();

  await context.close();
});
