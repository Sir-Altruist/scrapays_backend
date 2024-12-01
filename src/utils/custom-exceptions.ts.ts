export class ResourceNotFoundException extends Error {
    constructor(public notFoundError: string) {
      super(`Not found`);
      this.name = 'ResourceNotFoundException';
    }
  }
  
  export class ValidationFailedException extends Error {
    constructor(public validationError: string) {
      super('Validation Failed');
      this.name = 'ValidationFailedException';
    }
  }
  
  export class ServerErrorException extends Error {
    constructor(message: string, public serverError: string) {
      super(message);
      this.name = 'ServerErrorException';
    }
  }