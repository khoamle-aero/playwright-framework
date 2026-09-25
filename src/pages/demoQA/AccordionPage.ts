import { Locator, Page } from '@playwright/test';

export type AccordionSection = 'one' | 'two' | 'three';

const SECTIONS: Record<AccordionSection, string> = {
  one: 'What is Lorem Ipsum?',
  two: 'Where does it come from?',
  three: 'Why do we use it?',
};

export class AccordionPage {
  constructor(private readonly page: Page) {}

  async navigate(): Promise<void> {
    await this.page.goto('/accordian');
  }

  /** Clickable header, found by visible text */
  heading(section: AccordionSection): Locator {
    return this.page.getByText(SECTIONS[section], { exact: true });
  }

  /** Panel scoped to its own accordion item, no sibling/ID coupling */
  content(section: AccordionSection): Locator {
    return this.page
      .locator('.accordion-item')
      .filter({ has: this.heading(section) })
      .locator('.collapse');
  }

  async toggle(section: AccordionSection): Promise<void> {
    await this.heading(section).click();
  }
}