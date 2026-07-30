import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class ScreenshotHelper {
  constructor(private readonly page: Page) {}

  async capture(name: string, directory = 'reports/screenshots'): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeName = name.replace(/\s+/g, '-').toLowerCase();
    const fileName = `${safeName}-${timestamp}.png`;
    const outputDir = path.resolve(process.cwd(), directory);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = path.join(outputDir, fileName);
    await this.page.screenshot({ path: filePath, fullPage: true });
    return filePath;
  }
}
