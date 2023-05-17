import ApplicationError from './application.error';

class NotFoundException extends ApplicationError {
  constructor(message: string, status: number = 404) {
    super(message, status);
  }
}

export default NotFoundException;
