// Controla qué mensajes se muestran en la consola dependiendo de si estás en modo desarrollo o producción.

const isDev = typeof import.meta !== 'undefined' ? Boolean((import.meta as any).env?.DEV) : false

function safeConsole(method: 'info' | 'warn' | 'error', ...args: any[]) {
  try {
    // eslint-disable-next-line no-console
    console[method](...args)
  } catch (_) {
    // ignore
  }
}

export const logger = {
  debug: (...args: any[]) => {
    if (isDev) safeConsole('debug' as any, ...args)
  },
  info: (...args: any[]) => {
    if (isDev) safeConsole('info', ...args)
  },
  warn: (...args: any[]) => {
    if (isDev) safeConsole('warn', ...args)
  },
  error: (...args: any[]) => {
    safeConsole('error', ...args)
  },
}

export default logger
