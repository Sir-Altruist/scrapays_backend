// @nextjs/common covers these

import { HttpException, HttpStatus } from "@nestjs/common";

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

  export class UnauthorizationException extends Error {
    constructor(public unauthorizationError: string, public badToken?: boolean) {
      super('Unauthorized');
      this.name = 'UnauthorizationException';
    }
  }

  export class ForbiddenException extends Error {
    constructor(public message: string) {
      super('Forbidden');
      this.name = 'Forbidden';
    }
  }
  
  export class ServerErrorException extends Error {
    constructor(message: string, public serverError: string) {
      super(message);
      this.name = 'ServerErrorException';
    }
  }


  export class UnauthorizedException extends HttpException {
    constructor(message: string, code: any) {
      super(
        message,
        code // You can adjust the status code if needed
      )
    }
  }

  export function extractErrorObject(errorString) {
    console.log('error: ', errorString)
    const regex = /Unexpected error value: (.*)/;
    const match = errorString.match(regex);
  
    if (!match || match.length < 2) {
      return null; // Return null if no object is found
    }
  
    const errorObjectString = match[1];
  
    try {
      // Use JSON.parse with replaced single quotes for valid JSON format
      const sanitizedString = errorObjectString
        .replace(/'/g, '"') // Replace single quotes with double quotes
        .replace(/\s*([{}:,])\s*/g, '$1'); // Remove extra spaces around JSON characters
  
      return JSON.parse(sanitizedString);
    } catch (e) {
      console.error('Failed to parse the error object:', e);
      return null;
    }
  }