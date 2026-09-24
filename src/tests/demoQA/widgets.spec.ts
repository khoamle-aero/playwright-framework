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
    await accordion.expectExpanded('one');
    await accordion.expectCollapsed('two');
    await accordion.expectCollapsed('three');
  });
 
  test('clicking the open section collapses it', async () => {
    await accordion.toggle('one');
 
    for (const section of ALL_SECTIONS) {
      await accordion.expectCollapsed(section);
    }
  });
 
  for (const section of ['two', 'three'] as const) {
    test(`expanding section ${section} collapses the previously open one`, async () => {
      await accordion.toggle(section);
 
      await accordion.expectExpanded(section);
      await accordion.expectCollapsed('one');
    });
  }
 
  test('can switch between sections in sequence', async () => {
    await accordion.toggle('two');
    await accordion.expectExpanded('two');
 
    await accordion.toggle('three');
    await accordion.expectExpanded('three');
    await accordion.expectCollapsed('two');
 
    await accordion.toggle('one');
    await accordion.expectExpanded('one');
    await accordion.expectCollapsed('three');
  });
 
  test('a collapsed section can be reopened after being closed', async () => {
    await accordion.toggle('one'); // close
    await accordion.expectCollapsed('one');
 
    await accordion.toggle('one'); // reopen
    await accordion.expectExpanded('one');
  });
 
  for (const section of ALL_SECTIONS) {
    test(`section ${section} shows non-empty content when expanded`, async () => {
      if (section !== 'one') {
        await accordion.toggle(section);
      }
 
      await accordion.expectExpanded(section);
      await expect(accordion.content(section)).not.toBeEmpty();
    });
  }
});