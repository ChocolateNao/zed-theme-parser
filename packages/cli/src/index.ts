#!/usr/bin/env node

import { Command } from 'commander';
import { testCommand } from './commands/testCommand.ts';

const program = new Command();

program
  .name('zed-theme-parser')
  .description('A powerful CLI tool for parsing, validating and italicizing Zed editor themes')
  .option('--verbose', 'Enable verbose logging')
  .option('--no-color', 'Disable colored output')
  .version('0.1.0');

// Register commands
testCommand(program);

program.parseAsync(process.argv).catch((error: unknown) => {
  console.error('Fatal error:', error);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Exit code for unhandled error
  process.exit(1);
});
