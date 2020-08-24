export enum ExceptionLevel {
  WARNING = 1,
  ERROR = 2,
}

/**
 * Custom exception class for firing any exception that comes
 * from this library
 */
export class TetikusException extends Error {
  private readonly severity: number;

  constructor(message, severity = ExceptionLevel.ERROR) {
    super(`Tetikus: ${message}`);

    this.severity = severity;
    this.log();
  }

  private log() {
    switch (this.severity) {
      case ExceptionLevel.ERROR: {
        console.error(this.message);
        break;
      }
      case ExceptionLevel.WARNING: {
        if (process.env.NODE_ENV === 'development') {
          console.warn(this.message);
        }
      }
    }
  }
}
