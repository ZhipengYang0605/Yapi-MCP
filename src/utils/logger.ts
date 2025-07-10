import chalk from "chalk";

export const Logger = {
  isHTTP: false,
  log: (...args: any[]) => {
    Logger.isHTTP
      ? console.log(chalk.green("[YApi LOG]"), ...args)
      : console.error("[YApi LOG]", ...args);
  },
  error: (...args: any[]) => {
    Logger.isHTTP
      ? console.log(chalk.red("[YApi ERROR]"), ...args)
      : console.error("[YApi ERROR]", ...args);
  },
  warn: (...args: any[]) => {
    Logger.isHTTP
      ? console.log(chalk.yellow("[YApi WARN]"), ...args)
      : console.error("[YApi WARN]", ...args);
  },
  info: (...args: any[]) => {
    Logger.isHTTP
      ? console.log(chalk.blue("[YApi INFO]"), ...args)
      : console.error("[YApi INFO]", ...args);
  },
};
