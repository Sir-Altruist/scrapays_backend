import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { OtpDto, SignInDto, SignUpDto } from '../dto';
import { HttpStatus, Logger, UseInterceptors } from '@nestjs/common';
import { ValidateInput } from 'src/interceptors/validation';
import * as Tools from '../utils/tool';
import { GraphQLError } from 'graphql';
import { SuccessResponse } from 'src/entities/response.entity';
import { JwtService } from '@nestjs/jwt';

@Resolver(SuccessResponse)
export class AuthResolver {
    constructor(private readonly authService: AuthService, private readonly jwtService: JwtService){}

    @Mutation(() => SuccessResponse)
    @UseInterceptors(new ValidateInput(SignUpDto))
    async signUp(@Args('signUpDto') signUpDto: SignUpDto): Promise<SuccessResponse> {
        try {
            const { data } = await this.authService.findOne({ email: signUpDto.email })
            if(data?.length > 0) {
                throw Tools.ErrorWrapper('Email is already taken', {
                    code: HttpStatus.CONFLICT,
                    typename: "ConflictError"
                })
            }

            const user = await this.authService.signup({ ...signUpDto, connection: process.env.CONNECTION_TYPE, password: "Password@1" })
            return {
                user: {
                    id: user?.data?.['_id'],
                    email: user?.data?.email,
                    username: user?.data?.name

                },
                message: "You've successfully registered",
                code: HttpStatus.CREATED,
                status: "success"
            }
        } catch (error) {
            Logger.error(`Error registering new user: ${error?.message}`)
            if(error instanceof GraphQLError){
                throw error;
            }
            throw Tools.ErrorWrapper("Something went wrong! Please retry", {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                typename: "ServerError"
            })
        }
    }

    @Mutation(() => SuccessResponse)
    @UseInterceptors(new ValidateInput(SignInDto))
    async signIn(@Args('signInDto') signInDto: SignInDto): Promise<SuccessResponse>{
        try {
            let access_token;
            const { data } = await this.authService.findOne({ email: signInDto.email })
            if(data?.length === 0){
                throw Tools.ErrorWrapper("Incorrect Credentials", {
                    code: HttpStatus.NOT_FOUND,
                    typename: "NotFoundError"
                })
            }

            if(!data[0]?.email_verified){
                throw Tools.ErrorWrapper("Email is yet to be verified", {
                    code: HttpStatus.FORBIDDEN,
                    typename: "ForbiddenError"
                })
            }

            const user = await this.authService.signin(signInDto)
            if(user?.data?.access_token){
                access_token = this.jwtService.sign(
                    {
                        sub: data[0]?.user_id,
                        email: data[0]?.email
                    },
                    {
                        secret: process.env.TOKEN_SECRET,
                        expiresIn: '60m'
                    }
                )
            }
            return {
                token: access_token,
                message: "Login Successful",
                code: HttpStatus.OK,
                status: "success"
            }
        } catch (error) {
            Logger.error(`Error logging user in: ${error?.message}`)
            if(error instanceof GraphQLError){
                throw error;
            }
            throw Tools.ErrorWrapper("Something went wrong! Please retry", {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                typename: "ServerError"
            })
        }
    }

    @Mutation(() => SuccessResponse)
    @UseInterceptors(new ValidateInput(OtpDto))
    async sendOtp(@Args('otpDto') otpDtop: OtpDto): Promise<SuccessResponse>{
        try {
            const { data } = await this.authService.findOne({ email: otpDtop.email })
            if(data?.length === 0){
                throw Tools.ErrorWrapper("Incorrect Credential", {
                    code: HttpStatus.NOT_FOUND,
                    typename: "NotFoundError"
                })
            }

            if(!data[0]?.email_verified){
                throw Tools.ErrorWrapper("Email is yet to be verified", {
                    code: HttpStatus.FORBIDDEN,
                    typename: "ForbiddenError"
                })
            }
            
            await this.authService.sendOtp({ email: otpDtop?.email, send: 'code' })
            return {
                message: "Successfully sent Otp",
                code: HttpStatus.OK,
                status: "success"
            }
        } catch (error) {
            Logger.error(`Error in sending otp: ${error?.message}`)
            if(error instanceof GraphQLError){
                throw error;
            }
            throw Tools.ErrorWrapper("Something went wrong! Please retry", {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                typename: "ServerError"
            })
        }
    }


}
