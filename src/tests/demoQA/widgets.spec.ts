import { test, expect } from '@playwright/test';
import { AccordionPage, type AccordionSection } from '../../pages/demoQA/AccordionPage';

const ALL_SECTIONS: AccordionSection[] = ['one', 'two', 'three'];

test.describe('Accordion', () => {
  let accordion: AccordionPage;

  test.beforeEach(async ({ page }) => {
    accordion = new AccordionPage(page);
    await accordion.navigate();
  });

  test('loads with only the first section expanded', async () => {
    await expect(accordion.content('one')).toBeVisible();
    await expect(accordion.content('two')).toBeHidden();
    await expect(accordion.content('three')).toBeHidden();
  });

  test('clicking the open section collapses it', async () => {
    await accordion.toggle('one');

    for (const section of ALL_SECTIONS) {
      await expect(accordion.content(section)).toBeHidden();
    }
  });

  for (const section of ['two', 'three'] as const) {
    test(`expanding section ${section} collapses the previously open one`, async () => {
      await accordion.toggle(section);

      await expect(accordion.content(section)).toBeVisible();
      await expect(accordion.content('one')).toBeHidden();
    });
  }

  test('can switch between sections in sequence', async () => {
    await accordion.toggle('two');
    await expect(accordion.content('two')).toBeVisible();

    await accordion.toggle('three');
    await expect(accordion.content('three')).toBeVisible();
    await expect(accordion.content('two')).toBeHidden();

    await accordion.toggle('one');
    await expect(accordion.content('one')).toBeVisible();
    await expect(accordion.content('three')).toBeHidden();
  });

  test('a collapsed section can be reopened after being closed', async () => {
    await accordion.toggle('one'); // close
    await expect(accordion.content('one')).toBeHidden();

    await accordion.toggle('one'); // reopen
    await expect(accordion.content('one')).toBeVisible();
  });

  for (const section of ALL_SECTIONS) {
    test(`section ${section} shows non-empty content when expanded`, async () => {
      if (section !== 'one') {
        await accordion.toggle(section);
      }

      await expect(accordion.content(section)).toBeVisible();
      await expect(accordion.content(section)).not.toBeEmpty();
    });
  }
});