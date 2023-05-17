import ApplicationError from './application.error';

class ForbiddenException extends ApplicationError {
  constructor(message: string, status: number = 403) {
    super(message, status);
  }
}

export default ForbiddenException;
