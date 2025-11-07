import type { Command } from 'commander';

export function testCommand(program: Command): void {
  program
    .command('test')
    .description('Test CLI')
    .action(async () => {
      console.log('hello test');
    });
}
