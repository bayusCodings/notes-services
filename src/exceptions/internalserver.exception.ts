import ApplicationError from './application.error';

class InternalServerException extends ApplicationError {
  constructor(message: string, status: number = 500) {
    super(message, status);
  }
}

export default InternalServerException;
