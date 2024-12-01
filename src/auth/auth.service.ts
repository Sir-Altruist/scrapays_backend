import { Injectable, Logger } from '@nestjs/common';
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
import { ValidationFailedException } from 'src/utils/custom-exceptions.ts';
// import * as jwt from "jsonwebtoken"

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
            Logger.error(`Error in signup service: ${JSON.stringify(error)}`)
            if(error instanceof AuthApiError){
                throw new ValidationFailedException(error?.error_description)
            }
        }
    }

    async signin(data: LoginWithEmailRequest): Promise<any> {
        try {
            const token: any = await this.client.passwordless.loginWithEmail(data);
            // const decoded = jwt.decode(token);
            // console.log('Decoded Token:', decoded);
            return token;
        } catch (error) {
            Logger.error(`Error in signin service: ${JSON.stringify(error)}`)
            throw new ValidationFailedException(error?.error_description)
        }
    }

    async findOne(email: GetUsersByEmailRequest): Promise<ApiResponse<Array<GetUsers200ResponseOneOfInner>>>  {
        try {
            return await this.management.usersByEmail.getByEmail(email)
        } catch (error) {
            Logger.error(`Error in finidng user: ${JSON.stringify(error)}`)
            throw new ValidationFailedException(error?.error_description)
        }
        
    }

    async sendOtp(payload: SendEmailRequest): Promise<VoidApiResponse> {
        try {
            return await this.client.passwordless.sendEmail(payload)
        } catch (error) {
            Logger.error(`Error in sneding otp: ${JSON.stringify(error)}`)
            throw new ValidationFailedException(error?.error_description)
        }
    }
}
