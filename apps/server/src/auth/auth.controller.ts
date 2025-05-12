import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, SignupDto } from "./dto";
import { TokensInterceptor } from "./interceptor";

/**
 * Responsible for authentication endpoints extending from /auth
 * @endpoint /login
 * @endpoint /signup
 */
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post("login")
  @UseInterceptors(TokensInterceptor)
  login(@Body() loginInfo: LoginDto) {
    return this.authService.login(loginInfo);
  }
  @Post("signup")
  @UseInterceptors(TokensInterceptor)
  signup(@Body() signupInfo: SignupDto) {
    return this.authService.signup(signupInfo);
  }
}
