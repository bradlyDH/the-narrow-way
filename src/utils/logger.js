// src/utils/logger.js
let LEVELS = ['silent', 'error', 'warn', 'info', 'debug', 'trace'];
let current = __DEV__ ? 'debug' : 'warn';

export function setLogLevel(level) {
  if (LEVELS.includes(level)) current = level;
}
export function getLogLevel() {
  return current;
}

function shouldLog(want) {
  const order = { silent: 0, error: 1, warn: 2, info: 3, debug: 4, trace: 5 };
  return order[want] <= order[current];
}

function out(ns, level, args) {
  // eslint-disable-next-line no-console
  const fn =
    level === 'error'
      ? console.error
      : level === 'warn'
      ? console.warn
      : console.log;
  fn(`[${ns}]`, ...args);
}

/** Primary factory */
export function log(namespace = 'app') {
  return {
    error: (...a) => {
      if (shouldLog('error')) out(namespace, 'error', a);
    },
    warn: (...a) => {
      if (shouldLog('warn')) out(namespace, 'warn', a);
    },
    info: (...a) => {
      if (shouldLog('info')) out(namespace, 'info', a);
    },
    debug: (...a) => {
      if (shouldLog('debug')) out(namespace, 'debug', a);
    },
    trace: (...a) => {
      if (shouldLog('trace')) out(namespace, 'trace', a);
    },
  };
}

/** Back-compat alias: some files call createTaggedLogger(ns) */
export const createTaggedLogger = log;

/** Optional convenience: named “logger” pointing to log() */
export const logger = log;

/** Default export for flexibility */
export default {
  setLogLevel,
  getLogLevel,
  log,
  createTaggedLogger,
  logger,
};
