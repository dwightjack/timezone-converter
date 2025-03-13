// @ts-check
import { expect, test } from '@playwright/test';
import zones from './fixtures/zones';

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} name
 * @returns {import('@playwright/test').Locator}
 */
function getCard(page, name) {
  return page.locator('article', {
    has: page.getByRole('heading', { name }),
  });
}

test.beforeEach(async ({ page, context }) => {
  await page.route('/api/tzlist', async (route) => {
    const json = {
      zones,
    };
    await route.fulfill({ json });
  });
  await context.addInitScript({
    path: require.resolve('mockdate'),
  });
  await context.addInitScript(() => {
    window.MockDate.set('2022-08-03T00:00:00+09:00');
  });
  await page.goto('/');
});

test.describe('startup', () => {
  test.use({ timezoneId: 'Asia/Tokyo' });
  test('Automatically add current timezone card', async ({ page }) => {
    const card = await getCard(page, 'Asia/Tokyo');
    await expect(card).toBeVisible();
  });

  test('Automatically sets the current date', async ({ page }) => {
    const date = getCard(page, 'Asia/Tokyo').getByLabel('Date');
    await expect(date).toHaveAttribute('type', 'date');
    await expect(date).toHaveValue('2022-08-03');
  });

  test('Automatically sets the current time', async ({ page }) => {
    const time = getCard(page, 'Asia/Tokyo').getByLabel('Time');
    await expect(time).toHaveValue('00:00');
  });

  test('Has an auto-complete list of zones', async ({ page }) => {
    await expect(page.locator('datalist > option')).toHaveCount(zones.length);
    for (const { name } of zones) {
      await expect(
        page.locator(`datalist > option[value="${name}"]`),
      ).toHaveCount(1);
    }
  });
});

test.describe('interactions', () => {
  test.use({ timezoneId: 'Asia/Tokyo' });
  test.beforeEach(async ({ page }) => {
    await page
      .getByPlaceholder('Add a new timezone...')
      .type('Europe/Helsinki');
    await page.getByRole('button', { name: 'Add' }).click();
  });
  test('Add Europe/Helsinki time card', async ({ page }) => {
    const card = await getCard(page, 'Europe/Helsinki');
    await expect(card).toBeVisible();
    await expect(card.getByLabel('Date')).toHaveValue('2022-08-02');
    await expect(card.getByLabel('Time')).toHaveValue('18:00');
  });

  test('Added cards do not show in autocomplete', async ({ page }) => {
    const option = page.locator('datalist > option[value="Europe/Helsinki"]');
    await expect(option).toBeDisabled();
  });

  test('Remove Europe/Helsinki time card', async ({ page }) => {
    const card = await getCard(page, 'Europe/Helsinki');
    await card.getByRole('button', { name: 'Remove' }).click();
    await expect(getCard(page, 'Europe/Helsinki')).not.toBeVisible();

    await expect(
      page.locator('datalist > option[value="Europe/Helsinki"]'),
    ).toBeEnabled();
  });

  test('Changes to the date of one card updates other cards', async ({
    page,
  }) => {
    const tokyoCard = await getCard(page, 'Asia/Tokyo');
    const helsinkiCard = await getCard(page, 'Europe/Helsinki');

    await tokyoCard.getByLabel('Date').fill('2023-07-02');
    await expect(helsinkiCard.getByLabel('Date')).toHaveValue('2023-07-01');

    await helsinkiCard.getByLabel('Date').fill('2023-07-10');
    await expect(tokyoCard.getByLabel('Date')).toHaveValue('2023-07-11');
  });

  test('Changes to the time of one card updates other cards', async ({
    page,
  }) => {
    const tokyoCard = await getCard(page, 'Asia/Tokyo');
    const helsinkiCard = await getCard(page, 'Europe/Helsinki');

    await tokyoCard.getByLabel('Time').fill('09:00');
    await expect(helsinkiCard.getByLabel('Time')).toHaveValue('03:00');

    await helsinkiCard.getByLabel('Time').fill('23:00');
    await expect(tokyoCard.getByLabel('Time')).toHaveValue('05:00');
  });
});
