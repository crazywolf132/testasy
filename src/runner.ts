import * as glob from "glob";
import { TestasyConfig } from "./types";
import { injectCodeIntoFile } from "./injector";
import { runVitestTests } from "./vitestRunner";
import { runPlaywrightTests } from "./playwrightRunner";
import path from "node:path";
import fs from "node:fs";

export async function runTests(config: TestasyConfig) {
  // Discover test files
  const testFiles = glob.sync(config.testPattern, {
    ignore: ["**/node_modules/**"],
  });

  // Prepare injected test files
  const injectedTestFiles: string[] = [];
  for (const file of testFiles) {
    const injectedFilePath = await injectCodeIntoFile(
      file,
      config.injectCode,
      config.injectFiles,
    );
    injectedTestFiles.push(injectedFilePath);
  }

  // Run vitest tests
  await runVitestTests(injectedTestFiles, config);

  // Run playwright tests
  await runPlaywrightTests(injectedTestFiles, config);

  // Clean up temporary files
  await fs.promises.rm(".testasy-temp", { recursive: true, force: true });
}
