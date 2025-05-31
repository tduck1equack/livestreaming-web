import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Request, Response } from "express";
import { JwtAccessGuard } from "@auth/guard";
import { RolesGuard } from "@auth/guard";
import { Roles } from "@/decorators";
import { AUTH_ROLES } from "@/constants";
// import { CookiesInterceptor } from "@auth/interceptor";

/**
 * @controller Controller class related to /users API endpoints
 */

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}
  @Roles([AUTH_ROLES.ADMIN])
  @UseGuards(JwtAccessGuard, RolesGuard)
  // @UseInterceptors(CookiesInterceptor)
  @Get("test/userlist")
  getUserList(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.userService.getUserList();
  }
}
