import ApplicationError from './application.error';

class BadRequestException extends ApplicationError {
  constructor(message: string, status: number = 400) {
    super(message, status);
  }
}

export default BadRequestException;
