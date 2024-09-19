export interface TestasyConfig {
  testPattern: string;
  injectCode: string;
  injectFiles: string[];
  vitestConfig: object;
  playwrightConfig: object;
}
