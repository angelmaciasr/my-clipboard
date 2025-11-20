import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

export class Logger {
  private logFile: string;

  constructor() {
    const logDir = path.join(app.getPath('userData'), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    this.logFile = path.join(logDir, `app-${Date.now()}.log`);
  }

  private write(level: string, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] ${level}: ${message}`;
    if (data) {
      logMessage += ` ${JSON.stringify(data, null, 2)}`;
    }
    logMessage += '\n';

    fs.appendFileSync(this.logFile, logMessage);
    console.log(logMessage);
  }

  log(message: string, data?: any): void {
    this.write('INFO', message, data);
  }

  error(message: string, error?: any): void {
    const errorData = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : error;
    this.write('ERROR', message, errorData);
  }

  warn(message: string, data?: any): void {
    this.write('WARN', message, data);
  }

  debug(message: string, data?: any): void {
    this.write('DEBUG', message, data);
  }

  getLogFile(): string {
    return this.logFile;
  }
}

export const logger = new Logger();
