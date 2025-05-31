import { Body, Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, SignupDto } from "./dto";
import {
  AttachTokensInterceptor,
  RevokeTokensInterceptor,
} from "./interceptor";

/**
 * @controller Responsible for authentication endpoints extending from /auth
 * @endpoint /login
 * @endpoint /signup
 * @endpoint /signout
 */
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post("login")
  @UseInterceptors(AttachTokensInterceptor)
  login(@Body() loginInfo: LoginDto) {
    return this.authService.login(loginInfo);
  }
  @Post("signup")
  @UseInterceptors(AttachTokensInterceptor)
  signup(@Body() signupInfo: SignupDto) {
    return this.authService.signup(signupInfo);
  }
  @Get("signout")
  @UseInterceptors(RevokeTokensInterceptor)
  signout() {
    return this.authService.signout();
  }
}
