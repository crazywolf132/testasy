import { startVitest } from "vitest/node";
import { UserConfig as VitestUserConfig } from "vitest";
import { TestasyConfig } from "./types";

export async function runVitestTests(
  testFiles: string[],
  config: TestasyConfig,
): Promise<void> {
  const vitestConfig: VitestUserConfig = {
    ...config.vitestConfig,
    include: testFiles,
  };

  const vitest = await startVitest("test", [], {
    watch: false,
    run: true,
    ...vitestConfig,
  });

  const hasFailed = await vitest!.state
    .getFiles()
    .some((file) => file.result?.state === "fail");
  if (hasFailed) {
    process.exitCode = 1;
  }
}
