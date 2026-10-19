import { Controller, Post, Get, Inject, Body } from '@nestjs/common'
import { NATS_SERVICE } from 'src/config/services'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { LoginUserDto, RegisterUserDto } from './dto'

@Controller('auth')
export class AuthController {
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

    @Post('register')
    registerUser(@Body() registerUserDto: RegisterUserDto) {
        return this.client.send('auth.register.user', registerUserDto)
    }

    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto) {
        return this.client.send('auth.login.user', loginUserDto)
    }

    @Get('verify')
    verifyToken() {
        return this.client.send('auth.verify.user', {})
    }
}
