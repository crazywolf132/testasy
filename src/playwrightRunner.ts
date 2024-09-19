import { chromium, firefox, webkit, BrowserType } from "playwright";
import { TestasyConfig } from "./types";
import path from "node:path";

interface AutomationTest {
  name: string;
  fn: (context: { browser: any; context: any }) => Promise<void>;
}

export async function runPlaywrightTests(
  testFiles: string[],
  config: TestasyConfig,
): Promise<void> {
  let hasFailed = false;

  for (const file of testFiles) {
    const testModule = require(path.resolve(file));
    const automationTests: AutomationTest[] = testModule.automationTests || [];

    for (const test of automationTests) {
      console.log(`Running automation test: ${test.name}`);

      try {
        const browserType: BrowserType = chromium; // TODO: Make this configurable
        const browser = await browserType.launch(config.playwrightConfig);
        const context = await browser.newContext();
        await test.fn({ browser, context });
        await browser.close();
        console.log(`✔ ${test.name}`);
      } catch (error) {
        console.error(`❌ ${test.name}`);
        console.error(error);
        hasFailed = true;
      }
    }
  }

  if (hasFailed) {
    process.exitCode = 1;
  }
}
