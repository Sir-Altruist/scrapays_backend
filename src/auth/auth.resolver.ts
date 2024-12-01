import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { OtpDto, ResponseResult, SignInDto, SignUpDto } from '../dto';
import { HttpStatus, Logger, UseInterceptors } from '@nestjs/common';
import { ValidateInput } from 'src/interceptors/validation';
import { ResourceNotFoundException, ValidationFailedException } from 'src/utils/custom-exceptions.ts';
import { ErrorWrapper, handleError, handleSuccess } from 'src/utils/exceptions';
import { User } from 'src/entities/auth.entity';

@Resolver(User)
export class AuthResolver {
    constructor(private readonly authService: AuthService){}

    @Mutation(() => ResponseResult)
    @UseInterceptors(new ValidateInput(SignUpDto))
    async signUp(@Args('signUpDto') signUpDto: SignUpDto): Promise<typeof ResponseResult> {
        try {
            const { data } = await this.authService.findOne({ email: signUpDto.email })
            // if(data?.length > 0) throw new ValidationFailedException('Email is already taken')
            if(data?.length > 0) {
                ErrorWrapper('Email is already taken', {
                    code: HttpStatus.BAD_REQUEST,
                    typename: "ValidationError"
                })
            }

            const user: any = await this.authService.signup({ ...signUpDto, connection: process.env.CONNECTION_TYPE, password: "Password@1" })
            return handleSuccess({
                message: "You've successfully registered",
                code: HttpStatus.CREATED,
                user: {
                    id: user?.data?._id,
                    email: user?.data?.email,
                    name: user?.data?.name
                }
            })
        } catch (error) {
            Logger.error(`Error registering new user: ${error?.message}`)
            ErrorWrapper(error?.message, {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                typename: "ServerError"
            })
            // return handleError(error)
        }
    }

    @Mutation(() => ResponseResult)
    @UseInterceptors(new ValidateInput(SignInDto))
    async signIn(@Args('signInDto') signInDto: SignInDto): Promise<typeof ResponseResult>{
        try {
            const { data } = await this.authService.findOne({ email: signInDto.email })
            if(data?.length === 0) throw new ResourceNotFoundException('Incorrect credential')
            if(!data[0]?.email_verified) throw new ValidationFailedException('Email is yet to be verified. Kindly verify to continue')

            const user = await this.authService.signin(signInDto)
            return handleSuccess({
                message: "You've successfully logged In",
                token: user?.data?.access_token
            })
        } catch (error) {
            Logger.error(`Error logging user in: ${error?.message}`)
            return handleError(error)
        }
    }

    @Mutation(() => ResponseResult)
    @UseInterceptors(new ValidateInput(OtpDto))
    async sendOtp(@Args('otpDto') otpDtop: OtpDto): Promise<typeof ResponseResult>{
        try {
            const { data } = await this.authService.findOne({ email: otpDtop.email })
            if(data?.length === 0) throw new ResourceNotFoundException('Incorrect credential')
            if(!data[0]?.email_verified) throw new ValidationFailedException('Email is yet to be verified. Kindly verify to continue')
            
            await this.authService.sendOtp({ email: otpDtop?.email, send: 'code' })
            return handleSuccess({
                message: "Otp sent successfully. Kindly check your mail"
            })
        } catch (error) {
            Logger.error(`Error in sending otp: ${error?.message}`)
            return handleError(error)
        }
    }


}
