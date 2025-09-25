export class HttpError extends Error {
  status: number;
  advice?: string;

  constructor(status: number, message: string, advice?: string) {
    super(message);
    this.status = status;
    this.advice = advice;

    // Required to make instanceof checks work when targeting ES5
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}