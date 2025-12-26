import { Manager } from './Manager.mjs'
import type { LoggerOptions, Logger } from "pino";

export const Loggers = new Manager();

/**
 * ```
 * import { getLogger as Logger } from 'Logger.mjs'
 * Logger().info("log on default")
 * Logger("named").info("log on named logger")
 * ```
 */
export function getLogger(name: string = "default"): Logger {
  return Loggers.getLogger(name);
}

export function initLogger(name: string, options: LoggerOptions): Logger {
  return Loggers.initLogger(name, options)
}

