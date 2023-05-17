class ApplicationError extends Error {
  name: string;
  status: number;

  constructor(message: string, status: number) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Something went wrong, please try again';
    this.status = status || 500;
    this.message = message
  }
}

export default ApplicationError;
