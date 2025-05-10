import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, SignupDto } from "./dto";

/**
 * Responsible for authentication endpoints extending from /auth
 * @endpoint /login
 * @endpoint /signup
 */
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post("login")
  login(@Body() loginInfo: LoginDto) {
    return this.authService.login(loginInfo);
  }
  @Post("signup")
  signup(@Body() signupInfo: SignupDto) {
    return this.authService.signup(signupInfo);
  }
}
