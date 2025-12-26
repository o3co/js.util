import pino from "pino";
import type { LoggerOptions, Logger } from "pino";

export const defaultOptions = {
  level: "error",
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label: string) => {
      return {
        level: label,
      };
    },
  },
};

export class Manager {
  private loggers: pino.Logger[];

  constructor() {
    this.loggers = [];
    this.loggers["default"] = pino({
      level: "error",
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: {
        level: (label: string) => {
          return {
            level: label,
          };
        },
      },
    });
  }

  public initLogger(name: string, options: LoggerOptions): Logger {
    // ...
    this.loggers[name] = pino({
      ...defaultOptions,
      ...options,
    });

    return this.loggers[name];
  }

  public getLogger(name: string = "default"): Logger {
    const logger = this.loggers[name];

    if (!logger) {
      throw new Error(`Logger "${name}" is not existed`);
    }

    return logger;
  }
}

