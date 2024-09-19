import fs from "node:fs";
import path from "node:path";

export async function injectCodeIntoFile(
  filePath: string,
  injectCode: string,
  injectFiles: string[],
): Promise<string> {
  const originalContent = await fs.promises.readFile(filePath, "utf-8");

  let injectedContent = "";

  // Inject the automation test API
  injectedContent += `
    globalThis.automationTests = globalThis.automationTests || [];
    globalThis.automation = function(name, fn) {
      globalThis.automationTests.push({ name, fn });
    };
  `;

  // Inject code from strings
  if (injectCode) {
    injectedContent = injectCode + "\n";
  }

  // Inject code from files
  for (const injectFilePath of injectFiles) {
    const resolvedPath = path.resolve(process.cwd(), injectFilePath);
    const fileContent = await fs.promises.readFile(resolvedPath, "utf-8");
    injectedContent += fileContent + "\n";
  }

  injectedContent += originalContent;

  // Write to a temporary file
  const tempFilePath = path.join(".testasy-temp", path.basename(filePath));
  await fs.promises.mkdir(path.dirname(tempFilePath), { recursive: true });
  await fs.promises.writeFile(tempFilePath, injectedContent, "utf-8");

  return tempFilePath;
}
