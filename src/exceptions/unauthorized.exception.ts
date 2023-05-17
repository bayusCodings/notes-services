import ApplicationError from './application.error';

class UnauthorizedException extends ApplicationError {
  constructor(message: string, status: number = 401) {
    super(message, status);
  }
}

export default UnauthorizedException;
