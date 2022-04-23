import { Body, Controller, ParseIntPipe, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthContoller {
    constructor(private authService: AuthService) { }

    @Post('signin')
    async signIn(@Body() dto: AuthDto) {
        const { email, password } = await this.authService.signIn(dto)
        return { message: `Hey ${email}, You are logged in!` }
    }

    @Post('signup')
    async signUp(@Body() dto: AuthDto) {
        const user = await this.authService.signUp(dto)
        return { message: 'User Created', user }
    }
}