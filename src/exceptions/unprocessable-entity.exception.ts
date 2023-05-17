import ApplicationError from './application.error';

class UnprocessableEntityException extends ApplicationError {
  constructor(message: string, status: number = 422) {
    super(message, status);
  }
}

export default UnprocessableEntityException;
