import path from "node:path";
import { TestasyConfig } from "./types";

export async function loadConfig(configPath: string): Promise<TestasyConfig> {
  const resolvedPath = path.resolve(process.cwd(), configPath);

  let userConfig: Partial<TestasyConfig> = {};
  try {
    userConfig = (await import(resolvedPath)).default;
  } catch (error) {
    if (configPath !== "testasy.config.js") {
      throw new Error(
        `Failed to load config at ${resolvedPath}: ${error.message}`,
      );
    }
    // DEFAULT CONFIG
  }

  const defaultConfig: TestasyConfig = {
    testPattern: "**/*.test.{js,ts,jsx,tsx}",
    injectCode: "",
    injectFiles: [],
    vitestConfig: {},
    playwrightConfig: {},
  };

  return { ...defaultConfig, ...userConfig };
}
