import { expect, test } from '@playwright/test';

async function answerQuizQuestion(page) {
  const questionBefore = await page.locator('main h3').first().textContent();
  await page.locator('main button').filter({ hasText: /.+/ }).first().click();
  await expect(page.getByText(/Resposta correta|Resposta correta:/)).toBeVisible();
  await page.waitForTimeout(900);
  await expect(page.locator('main h3').first()).toHaveText(questionBefore);

  const nextButton = page.getByRole('button', { name: /Próxima|Ver revisão/ });
  const nextButtonLabel = await nextButton.textContent();
  await nextButton.click();
  return nextButtonLabel;
}

async function finishQuizToMemoryIntro(page) {
  for (let index = 0; index < 11; index += 1) {
    await answerQuizQuestion(page);
  }

  await expect(page.getByText('Revisão do quiz')).toBeVisible();
  await page.getByRole('button', { name: 'Continuar para o desafio da memória' }).click();
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
  await expect(page.getByRole('heading', { name: 'Dicas para Iniciar sua Carreira' })).toBeVisible();
  await expect(page.evaluate(() => window.__spaMarker)).resolves.toBe('alive');
});

test('footer links use SPA routing', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.__spaMarker = 'alive';
  });

  await page.getByRole('contentinfo').getByRole('link', { name: 'Mapa' }).click();

  await expect(page).toHaveURL(/\/mapa$/);
  await expect(page.getByRole('heading', { name: '🌍 Mapa de Unidades' })).toBeVisible();
  await expect(page.evaluate(() => window.__spaMarker)).resolves.toBe('alive');
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
  await page.goto('/game');

  const label = await answerQuizQuestion(page);
  expect(label).toMatch(/Próxima|Ver revisão/);
});

test('vocational test shows top 3 profiles and percentages', async ({ page }) => {
  await page.goto('/testes');

  for (let index = 0; index < 6; index += 1) {
    await page.locator('main button').first().click();
  }

  await expect(page.getByText('Resultado vocacional')).toBeVisible();
  await expect(page.getByText('#1')).toBeVisible();
  await expect(page.getByText('#2')).toBeVisible();
  await expect(page.getByText('#3')).toBeVisible();
  await expect(page.locator('main').getByText(/%/).first()).toBeVisible();
});

test('memory game supports difficulty, preview and timeout loss state', async ({ page }) => {
  await page.clock.install();
  await page.goto('/game');
  await finishQuizToMemoryIntro(page);

  await page.getByRole('button', { name: /Fácil/ }).click();
  await expect(page.getByText(/Memorize as cartas/)).toBeVisible();

  await page.clock.runFor(3_000);
  await expect(page.getByText(/Memorize as cartas/)).toBeHidden();
  await expect(page.getByText('Fácil')).toBeVisible();

  await page.clock.runFor(75_000);
  await expect(page.getByRole('heading', { name: 'Tempo esgotado' })).toBeVisible();
  await expect(page.getByText('Pontuação:')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ver resultado final' })).toBeVisible();
});
