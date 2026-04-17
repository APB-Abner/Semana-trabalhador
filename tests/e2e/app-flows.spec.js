test('vocational test shows enriched result, dimensions and persists the summary', async ({ page }) => {
  await page.goto('/testes');

  for (let index = 0; index < 10; index += 1) {
    await page.locator('main button[aria-pressed]').first().click();
  }

  await expect(page.getByText('Resultado vocacional')).toBeVisible();
  await expect(page.getByText('#1')).toBeVisible();
  await expect(page.getByText('#2')).toBeVisible();
  await expect(page.getByText('#3')).toBeVisible();
  await expect(page.getByText(/Mapa de dimensões/i)).toBeVisible();
  await expect(page.getByText(/Próximos passos/i)).toBeVisible();

  await page.getByRole('button', { name: /Refazer/ }).click();
  await expect(page.getByText(/Último perfil salvo|perfil principal/i)).toBeVisible();
});