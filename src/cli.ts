#!/usr/bin/env node

import { Command } from "commander";
import { loadConfig } from "./config";
import { runTests } from "./runner";
import { version } from "../package.json";

const program = new Command();

program
  .name("testasy")
  .version(version)
  .option("-c, --config <path>", "Path to the config file", "testasy.config.js")
  .parse(process.argv);

const options = program.opts();

async function main() {
  try {
    console.log("Loading config...");
    const config = await loadConfig(options.config);
    console.log({ config });
    await runTests(config);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
