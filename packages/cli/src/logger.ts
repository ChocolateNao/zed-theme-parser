import chalk, { type ChalkInstance } from 'chalk';

enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = LogLevel.INFO;
  private colorEnabled = true;
  private readonly sepLength = Number.isNaN(process.stdout.columns) ? 80 : process.stdout.columns;

  static getInstance(): Logger {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- singleton pattern
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  setColorEnabled(enabled: boolean): void {
    this.colorEnabled = enabled;
  }

  private formatMessage(level: string, message: string): string {
    if (!this.colorEnabled) {
      return `[${level}] ${message}`;
    }

    const colors: Record<string, ChalkInstance> = {
      ERROR: chalk.red,
      WARN: chalk.yellow,
      INFO: chalk.blue,
      DEBUG: chalk.gray,
      SUCCESS: chalk.green,
    };

    const color = colors[level] ?? chalk.white;
    return `${color.bold(`[${level}]`)} ${message}`;
  }

  error(message: string, error?: Error): void {
    if (this.logLevel >= LogLevel.ERROR) {
      console.error(this.formatMessage('ERROR', message));
      if (error != null) {
        console.error(this.formatMessage('ERROR', error.message));
        if (this.logLevel >= LogLevel.DEBUG && error.stack != null) {
          console.error(this.formatMessage('DEBUG', error.stack));
        }
      }
    }
  }

  warn(message: string): void {
    if (this.logLevel >= LogLevel.WARN) {
      console.warn(this.formatMessage('WARN', message));
    }
  }

  info(message: string): void {
    if (this.logLevel >= LogLevel.INFO) {
      console.log(this.formatMessage('INFO', message));
    }
  }

  debug(message: string): void {
    if (this.logLevel >= LogLevel.DEBUG) {
      console.log(this.formatMessage('DEBUG', message));
    }
  }

  success(message: string): void {
    console.log(this.formatMessage('SUCCESS', message));
  }

  static table(data: Array<Record<string, unknown>>): void {
    console.table(data);
  }

  separator(): void {
    console.log(`\n${'─'.repeat(this.sepLength)}\n`);
  }
}

const logger = Logger.getInstance();

export { LogLevel, logger };
