import chalk from 'chalk';

export class Logger {
  private isVerbose = false;
  private useColor = true;

  setVerbose(verbose: boolean): void {
    this.isVerbose = verbose;
  }

  setColor(enabled: boolean): void {
    this.useColor = enabled;
  }

  private format(message: string, color: (msg: string) => string): string {
    return this.useColor ? color(message) : message;
  }

  info(message: string): void {
    console.log(this.format(message, chalk.blue));
  }

  success(message: string): void {
    console.log(this.format(`✓ ${message}`, chalk.green));
  }

  warn(message: string): void {
    console.log(this.format(`⚠ ${message}`, chalk.yellow));
  }

  error(message: string): void {
    console.error(this.format(`✗ ${message}`, chalk.red));
  }

  debug(message: string): void {
    if (this.isVerbose) {
      console.log(this.format(`[DEBUG] ${message}`, chalk.gray));
    }
  }
}
