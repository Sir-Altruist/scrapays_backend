import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { 
    ApiResponse, 
    AuthApiError, 
    AuthenticationClient, 
    GetUsers200ResponseOneOfInner, 
    GetUsersByEmailRequest, 
    LoginWithEmailRequest, 
    ManagementClient, 
    SendEmailRequest, 
    SignUpRequest, 
    VoidApiResponse 
} from 'auth0';
import 'dotenv/config';
import { ErrorWrapper } from '../utils/exceptions';
import { GraphQLError } from 'graphql';

@Injectable()
export class AuthService {
    private client: AuthenticationClient;
    private management: ManagementClient;

    constructor(){
        this.client = new AuthenticationClient({
            domain: process.env.AUTH0_DOMAIN_NAME!,
            clientId: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET
        })

        this.management = new ManagementClient({
            domain: process.env.AUTH0_DOMAIN_NAME!,
            clientId: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET
        });
    }

    async signup(payload: SignUpRequest) {
        try {
            return await this.client.database.signUp(payload);
        } catch (error) {
            Logger.error(`Error in signup service: ${error?.error_description}`)
            if(error instanceof AuthApiError){
                throw ErrorWrapper(error?.error_description, {
                    code: error?.statusCode,
                    typename: error?.body ? JSON.parse(error.body).name : "AuthError"
                })
            }

            if(error instanceof GraphQLError){
                throw error
            }

            throw ErrorWrapper("Something went wrong. Please retry", {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                typename: "ServerError"
            })
        }
    }

    async signin(data: LoginWithEmailRequest): Promise<any> {
        try {
            return await this.client.passwordless.loginWithEmail(data);
        } catch (error) {
            Logger.error(`Error in signin service: ${error?.error_description}`)

            if(error instanceof AuthApiError){
                throw ErrorWrapper(error?.error_description, {
                    code: error?.statusCode,
                    typename: error?.body ? JSON.parse(error.body).name : "AuthError"
                })
            }

            if(error instanceof GraphQLError){
                throw error
            }

            throw ErrorWrapper("Something went wrong. Please retry", {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                typename: "ServerError"
            })
        }
    }

    async findOne(email: GetUsersByEmailRequest): Promise<ApiResponse<Array<GetUsers200ResponseOneOfInner>>>  {
        try {
            return await this.management.usersByEmail.getByEmail(email)
        } catch (error) {
            Logger.error(`Error in finidng user: ${error?.error_description}`)
            if(error instanceof AuthApiError){
                throw ErrorWrapper(error?.error_description, {
                    code: error?.statusCode,
                    typename: error?.body ? JSON.parse(error.body).name : "AuthError"
                })
            }

            if(error instanceof GraphQLError){
                throw error
            }

            throw ErrorWrapper("Something went wrong. Please retry", {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                typename: "ServerError"
            })
        }
    }

    async sendOtp(payload: SendEmailRequest): Promise<VoidApiResponse> {
        try {
            return await this.client.passwordless.sendEmail(payload)
        } catch (error) {
            Logger.error(`Error in sneding otp: ${error?.error_description}`)
            if(error instanceof AuthApiError){
                throw ErrorWrapper(error?.error_description, {
                    code: error?.statusCode,
                    typename: error?.body ? JSON.parse(error.body).name : "AuthError"
                })
            }

            if(error instanceof GraphQLError){
                throw error
            }

            throw ErrorWrapper("Something went wrong. Please retry", {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                typename: "ServerError"
            })
        }
    }
}
