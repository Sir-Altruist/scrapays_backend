import { 
    Injectable, 
    NestInterceptor, 
    ExecutionContext, 
    CallHandler,
    HttpStatus
  } from '@nestjs/common';
  import { validate } from 'class-validator';
  import { ValidationFailedException } from '../utils/custom-exceptions.ts.js';
import { Observable, of } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ErrorWrapper, handleError } from '../utils/exceptions';

  
  @Injectable()
  export class ValidateInput implements NestInterceptor {

    constructor(private readonly dto?: any) {}

    async intercept(
      context: ExecutionContext, 
      next: CallHandler
    ): Promise<Observable<any>> {
        try {
            
            const gqlContext = GqlExecutionContext.create(context);
        
             // Convert to GraphQL context
             // Get the arguments from the GraphQL context
            const contextArgs = gqlContext.getArgs();
             
            // Find the input argument (assuming it's the first non-undefined argument)
            const inputArg = Object.values(contextArgs).find(arg => arg !== undefined);

            if (!inputArg) {
                return of(new ValidationFailedException('No input argument found for validation'))
            }
         
            // Convert plain object to class instance
            const dtoInstance: any = plainToInstance(this.dto, inputArg, { 
               enableImplicitConversion: true 
            });
         
            // Validate the instance
            const errors = await validate(dtoInstance);
         
            if (errors.length > 0) {
                //Transform validation errors
                const formattedErrors = errors.map(error => Object.values(error?.constraints || {}).join(','))
                ErrorWrapper(formattedErrors[0], {
                    code: HttpStatus.BAD_REQUEST,
                    typename: "ValidationError"
                })
                // throw new ValidationFailedException(formattedErrors[0])
            }
             return next.handle();
        }
        catch (error) {
            return of(handleError(error))
        }
    }
}
