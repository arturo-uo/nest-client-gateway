import { Controller, Post, Get, Inject, Body, Req, UseGuards } from '@nestjs/common'
import { NATS_SERVICE } from 'src/config/services'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { LoginUserDto, RegisterUserDto } from './dto'
import { catchError } from 'rxjs'
import { AuthGuard } from 'src/guards/auth.guard'
import { User } from './decorators/user.decorator'
import { Token } from './decorators/token.decorator'
import type { CurrentUser } from './interfaces/current-user.interface'

@Controller('auth')
export class AuthController {
	constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

	@Post('register')
	registerUser(@Body() registerUserDto: RegisterUserDto) {
		return this.client.send('auth.register.user', registerUserDto)
			.pipe(
				catchError(error => {
					throw new RpcException(error)
				})
			)
	}

	@Post('login')
	loginUser(@Body() loginUserDto: LoginUserDto) {
		return this.client.send('auth.login.user', loginUserDto)
			.pipe(
				catchError(error => {
					throw new RpcException(error)
				})
			)
	}

	@UseGuards(AuthGuard)
	@Get('verify')
	verifyToken(@User() user: CurrentUser, @Token() token: string) {
		return { user , token}
	}
}
