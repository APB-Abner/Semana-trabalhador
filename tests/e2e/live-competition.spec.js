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
  const confirmButton = page.getByRole('button', { name: 'Confirmar resposta' });
  const usesExplicitConfirm = await confirmButton.isVisible({ timeout: 500 }).catch(() => false);

  if (usesExplicitConfirm) {
    const options = page.locator('main button[aria-pressed]');
    const optionCount = Math.min(await options.count(), 3);

    for (let index = 0; index < optionCount; index += 1) {
      await options.nth(index).click();
    }

    await confirmButton.click();
  } else {
    await page.locator('main button[aria-pressed]').first().click();
  }

  await expect(page.locator('main').getByText(/Resposta enviada|Resposta correta|Respostas corretas/).first()).toBeVisible();
}

async function answerWorkSituationRound(host, ana, bia) {
  await expect(ana.getByText('Situação Profissional').first()).toBeVisible();
  await ana.locator('main button[aria-pressed]').first().click();
  await expect(ana.getByText(/Decisão enviada/)).toBeVisible();
  await bia.locator('main button[aria-pressed]').nth(1).click();
  await expect(ana.getByText(/Melhor decisão:/)).toBeVisible();
  await expect(host.getByText(/Melhor decisão:/)).toBeVisible();
  await expect(host.getByText('Distribuição das escolhas')).toBeVisible();
  await expect(host.getByText('Placar da rodada')).toBeVisible();
}

async function nextRound(hostPage) {
  const advanceButton = hostPage.getByRole('button', { name: /xima rodada|Finalizar match|Ver ranking parcial/ });
  const advanceLabel = await advanceButton.textContent();
  await advanceButton.click();

  if (!/Ver ranking parcial/.test(advanceLabel ?? '')) {
    return;
  }

  const continueButton = hostPage.getByRole('button', { name: /Liberar.*jogo/ });
  await continueButton.click();

  const introButton = hostPage.getByRole('button', { name: /^Iniciar / });
  await introButton.click();
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

test('live competition supports balanced match minigames', async ({ browser }) => {
  const context = await browser.newContext();
  const host = await context.newPage();
  const display = await context.newPage();
  const ana = await context.newPage();
  const bia = await context.newPage();

  await host.goto('/competicao/host');
  await host.getByRole('button', { name: 'Criar sala' }).click();
  await expect(host).toHaveURL(/\/competicao\/host\/\d{6}$/);
  const pin = host.url().split('/').pop();

  await display.goto(`/competicao/exibicao/${pin}`);
  await expect(display.getByText('Entre na sala')).toBeVisible();
  await expect(display.locator('section').getByText(pin)).toBeVisible();
  await expect(display.getByRole('button', { name: 'Iniciar match' })).toHaveCount(0);

  for (const [page, name] of [[ana, 'Ana'], [bia, 'Bia']]) {
    await page.goto('/competicao/entrar');
    await page.getByLabel('Nome').fill(name);
    await page.getByLabel('PIN da sala').fill(pin);
    await page.getByRole('button', { name: 'Entrar na sala' }).click();
    await expect(page.getByText(/Aguardando o host iniciar/)).toBeVisible();
  }

  await expect(host.locator('main').getByText('Ana', { exact: true })).toBeVisible();
  await expect(host.locator('main').getByText('Bia', { exact: true })).toBeVisible();

  await host.getByRole('button', { name: 'Iniciar match' }).click();
  await expect(host.getByRole('button', { name: /Iniciar Quiz Relâmpago/ })).toBeVisible();
  await expect(display.getByText('Quiz Relâmpago').first()).toBeVisible();
  await host.getByRole('button', { name: /Iniciar Quiz Relâmpago/ }).click();
  await expect(ana.getByRole('heading', { level: 3 })).toBeVisible();
  await answerFirstOption(ana);
  await answerFirstOption(bia);
  await expect(host.getByText('Placar da rodada')).toBeVisible();

  for (let roundIndex = 0; roundIndex < 3; roundIndex += 1) {
    await nextRound(host);
    await answerFirstOption(ana);
    await answerFirstOption(bia);
    await expect(host.getByText('Placar da rodada')).toBeVisible();
  }

  await nextRound(host);
  await answerWorkSituationRound(host, ana, bia);

  await nextRound(host);
  await answerWorkSituationRound(host, ana, bia);

  await nextRound(host);
  await answerWorkSituationRound(host, ana, bia);

  await nextRound(host);
  await expect(ana.getByText('Ordem de Prioridade').first()).toBeVisible();
  await ana.getByRole('button', { name: /para baixo/ }).first().click();
  await ana.getByRole('button', { name: 'Confirmar ordem' }).click();
  await expect(ana.getByRole('button', { name: 'Ordem enviada' })).toBeDisabled();
  await bia.getByRole('button', { name: 'Confirmar ordem' }).click();
  await expect(ana.getByText('Ordem ideal').first()).toBeVisible();
  await expect(ana.getByText('Posições certas')).toBeVisible();
  await expect(host.getByText('Ordem ideal').first()).toBeVisible();
  await expect(host.getByText('Placar da rodada')).toBeVisible();

  await context.close();
});
