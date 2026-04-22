import { expect, test } from '@playwright/test';

const nextQuizButton = /Pr.{0,3}xima|Ver revis/i;

async function answerQuizQuestion(page, optionIndex = 0) {
  const questionBefore = await page.locator('main h3').first().textContent();
  const options = page.locator('main button[aria-pressed]');
  const optionCount = await options.count();
  await options.nth(Math.min(optionIndex, optionCount - 1)).click();
  await expect(page.getByText(/Resposta correta/)).toBeVisible();
  await expect(page.locator('main h3').first()).toHaveText(questionBefore);

  const nextButton = page.getByRole('button', { name: nextQuizButton });
  const nextButtonLabel = await nextButton.textContent();
  await nextButton.click();
  return nextButtonLabel;
}

async function finishQuizToMemoryIntro(page) {
  for (let index = 0; index < 11; index += 1) {
    await answerQuizQuestion(page);
  }

  await expect(page.getByText(/Revis/)).toBeVisible();
  await page.getByRole('button', { name: /Continuar para o desafio/ }).click();
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeVisible();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByRole('heading', { name: 'Escolha a dificuldade' })).toBeVisible();
}

test('mobile navigation uses SPA routing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => {
    window.__spaMarker = 'alive';
  });

  await page.getByRole('button', { name: 'Open main menu' }).click();
  await page.locator('[data-headlessui-state="open"][href="/dicas"]').click();

  await expect(page).toHaveURL(/\/dicas$/);
  await expect(page.getByRole('heading', { name: /Dicas para Iniciar/ })).toBeVisible();
  await expect(page.evaluate(() => window.__spaMarker)).resolves.toBe('alive');
});

test('footer links use SPA routing', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.__spaMarker = 'alive';
  });

  await page.getByRole('contentinfo').getByRole('link', { name: 'Mapa' }).click();

  await expect(page).toHaveURL(/\/mapa$/);
  await expect(page.getByRole('heading', { name: /Mapa de Unidades/ })).toBeVisible();
  await expect(page.evaluate(() => window.__spaMarker)).resolves.toBe('alive');
});

test('direct URLs and reload keep route rendering', async ({ page }) => {
  await page.goto('/mapa');
  await expect(page.getByRole('heading', { name: /Mapa de Unidades/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: /Mapa de Unidades/ })).toBeVisible();

  await page.goto('/game');
  await expect(page.getByRole('heading', { name: /Desafio Jovem Trabalhador/ })).toBeVisible();

  await page.goto('/testes');
  await expect(page.getByRole('heading', { name: /Teste Vocacional Interativo/ })).toBeVisible();
});

test('competition route renders without requiring the live backend', async ({ page }) => {
  await page.goto('/competicao');

  await expect(page.locator('[data-app-nav]')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Competicao Jovem Trabalhador|Competi/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Criar sala como host' })).toHaveAttribute('href', '/competicao/host');
  await expect(page.getByRole('link', { name: 'Entrar com PIN' })).toHaveAttribute('href', '/competicao/entrar');
});

test('theme preference persists after reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Alternar modo escuro' }).click();

  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
});

test('tips sidebar scrolls to sections and highlights the active item', async ({ page }) => {
  await page.goto('/dicas');

  const sidebar = page.locator('aside');
  const interviewLink = sidebar.getByRole('link', { name: /Como Se Comportar em uma Entrevista/ });
  await interviewLink.click();

  await expect(page).toHaveURL(/#entrevista$/);
  await expect(page.locator('#entrevista')).toBeInViewport();
  await expect(interviewLink).toHaveAttribute('aria-current', 'true');
});

test('quiz shows feedback and waits for explicit next action', async ({ page }) => {
  await page.clock.install();
  await page.goto('/game');

  const questionBefore = await page.locator('main h3').first().textContent();
  await page.locator('main button[aria-pressed]').first().click();
  await expect(page.getByText(/Resposta correta/)).toBeVisible();
  await page.clock.runFor(5_000);

  await expect(page.locator('main h3').first()).toHaveText(questionBefore);
});

test('quiz keyboard navigation wraps options and submits with enter', async ({ page }) => {
  await page.goto('/game');
  const options = page.locator('main button[aria-pressed]');
  const lastOptionIndex = await options.count() - 1;
  const lastOptionText = await options.nth(lastOptionIndex).textContent();

  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter');

  await expect(options.nth(lastOptionIndex)).toHaveAttribute('aria-pressed', 'true');
  await expect(options.nth(lastOptionIndex)).toHaveText(lastOptionText);
  await expect(page.getByText(/Resposta correta/)).toBeVisible();
});

test('quiz review with errors is shown and persisted after reload', async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.goto('/game');

  for (let index = 0; index < 11; index += 1) {
    await answerQuizQuestion(page, 3);
  }

  await expect(page.getByText(/Respostas para revisar/)).toBeVisible();
  await expect(page.locator('main').getByText(/score/)).toBeVisible();

  await page.reload();
  await expect(page.getByText(/Resumo salvo do quiz/)).toBeVisible();
});

test('vocational test shows enriched result, dimensions and persists the summary', async ({ page }) => {
  await page.goto('/testes');

  for (let index = 0; index < 10; index += 1) {
    await page.locator('main button[aria-pressed]').first().click();
  }

  await expect(page.getByText('Resultado vocacional')).toBeVisible();
  await expect(page.getByText('#1')).toBeVisible();
  await expect(page.getByText('#2')).toBeVisible();
  await expect(page.getByText('#3')).toBeVisible();
  await expect(page.getByText(/Mapa de dimens/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Pr.ximos passos/i })).toBeVisible();

  await page.getByRole('button', { name: /Refazer/ }).click();
  await expect(page.getByText(/ltimo perfil salvo/i)).toBeVisible();
});

test('memory game supports difficulty, preview, timeout loss state and replay', async ({ page }) => {
  await page.clock.install();
  await page.goto('/game');
  await finishQuizToMemoryIntro(page);

  await page.getByRole('button', { name: /F/ }).first().click();
  await expect(page.getByText(/Memorize as cartas/)).toBeVisible();

  await page.clock.runFor(3_000);
  await expect(page.getByText(/Memorize as cartas/)).toBeHidden();
  await expect(page.getByText(/F/).first()).toBeVisible();

  await page.clock.runFor(75_000);
  await expect(page.getByRole('heading', { name: 'Tempo esgotado' })).toBeVisible();
  await expect(page.getByText(/Pontua/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ver resultado final' })).toBeVisible();

  await page.getByRole('button', { name: 'Jogar novamente' }).click();
  await expect(page.getByText(/Memorize as cartas/)).toBeVisible();
});
