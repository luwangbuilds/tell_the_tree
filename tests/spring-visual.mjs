import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
try {
  await mkdir(new URL('../test-results/', import.meta.url), { recursive: true });
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.goto('http://localhost:4183/#tree');
  await page.evaluate(async () => {
    const m = await import('/model.js');
    let garden = m.blankGarden();
    for (const action of ['Send a message to a friend', 'Take a short walk', 'Write the first sentence', 'Make space for a break', 'Ask for a little help']) {
      garden = m.addWorry(garden, 'A private worry');
      garden = m.chooseAction(garden, garden.leaves.at(-1).id, action);
    }
    garden = m.harvestFlowers(garden, garden.flowers.slice(-2).map(f => f.id));
    garden = m.addWorry(garden, 'Where should I begin?');
    garden = m.addWorry(garden, 'Making room for everything this week');
    garden = m.addWorry(garden, 'Finding the courage to ask for help');
    localStorage.setItem(m.STORAGE_KEY, JSON.stringify(garden));
  });
  await page.reload();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width > 640 ? 1000 : 844 });
    for (const route of ['tree', 'garden', 'breathe', 'treasure', 'finish']) {
      await page.goto('http://localhost:4183/#' + route);
      await page.locator('#main').waitFor();
      await page.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} overflow at ${width}`);
      if (route === 'tree') {
        assert.match(await page.locator('.tree-art').getAttribute('src'), /spring-tree/);
        await page.locator('.chest').click();
        await page.waitForURL('**/#treasure');
        await page.goto('http://localhost:4183/#tree');
        assert.equal(await page.locator('.tree-marker, .tree-harvest-below').count(), 0);
        const point = await page.locator('.tree-heart').boundingBox();
        const scene = await page.locator('.tree-scene').boundingBox();
        assert.ok(point.width >= 44 && point.height >= 44);
        assert.ok((point.x + point.width / 2 - scene.x) / scene.width > .4);
        assert.ok((point.y + point.height / 2 - scene.y) / scene.height > .6);
      }
      if (route === 'treasure') {
        assert.equal(await page.locator('.harvest-card').count(), 1);
        await page.locator('.harvest-card').click();
        assert.equal(await page.locator('.action-history li').count(), 2);
        await page.keyboard.press('Escape');
      }
      if (route === 'garden') {
        await page.getByRole('button', { name: /Worry leaves/ }).click();
        assert.equal(await page.locator('.worry-card').count(), 3);
        await page.locator('#main').focus();
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: `test-results/collection-leaves-${width}.png`, fullPage: true });
        await page.getByRole('button', { name: /Intention flowers/ }).click();
        await page.getByRole('button', { name: 'Clear selection', exact: true }).click();
        await page.getByRole('checkbox').first().check();
        await page.getByRole('checkbox').last().check();
        assert.equal(await page.getByRole('checkbox', { checked: true }).count(), 2);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `flowers overflow at ${width}`);
      }
      await page.locator('#main').focus();
      await page.evaluate(() => scrollTo(0, 0));
      await page.mouse.move(0, 0);
      await page.screenshot({ path: `test-results/spring-${route}-${width}.png`, fullPage: true });
    }
  }
  console.log('PASS: glow entrance, leaf and selected-flower collections, chest navigation, saved intentions and all five routes at 320/390/768/1440px without horizontal overflow.');
} finally { await browser.close(); }
