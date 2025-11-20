// Logger para el renderer process que envía logs al main process
const logs: Array<{ timestamp: string; level: string; message: string; data?: any }> = [];

export class RendererLogger {
  log(message: string, data?: any): void {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message,
      data,
    };
    logs.push(entry);
    console.log(`[INFO] ${message}`, data);
  }

  error(message: string, error?: any): void {
    const errorData = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : error;
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      data: errorData,
    };
    logs.push(entry);
    console.error(`[ERROR] ${message}`, errorData);
  }

  warn(message: string, data?: any): void {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'WARN',
      message,
      data,
    };
    logs.push(entry);
    console.warn(`[WARN] ${message}`, data);
  }

  debug(message: string, data?: any): void {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'DEBUG',
      message,
      data,
    };
    logs.push(entry);
    console.debug(`[DEBUG] ${message}`, data);
  }

  getLogs(): Array<{ timestamp: string; level: string; message: string; data?: any }> {
    return logs;
  }

  dumpLogs(): void {
    console.log('=== RENDERER LOGS ===');
    logs.forEach((log) => {
      console.log(`[${log.timestamp}] ${log.level}: ${log.message}`, log.data);
    });
    console.log('=== END LOGS ===');
  }
}

export const logger = new RendererLogger();
