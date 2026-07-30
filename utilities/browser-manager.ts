import { chromium, firefox, webkit, Browser, BrowserType } from '@playwright/test';

export type BrowserName = 'chromium' | 'firefox' | 'webkit';

export class BrowserManager {
  static async launch(browserName: BrowserName = 'chromium'): Promise<Browser> {
    const browserFactory: Record<BrowserName, BrowserType> = {
      chromium,
      firefox,
      webkit,
    };

    const factory = browserFactory[browserName];
    if (!factory) {
      throw new Error(`Unsupported browser: ${browserName}`);
    }

    return factory.launch();
  }
}
