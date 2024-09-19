import { TestasyConfig } from "./src/types";

const config: TestasyConfig = {
  testPattern: "**/*.test.{js,ts,jsx,tsx}",
  injectCode: "",
  injectFiles: [],
  vitestConfig: {},
  playwrightConfig: {},
};

export default config;
