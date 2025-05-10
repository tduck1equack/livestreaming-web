import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request, Response } from "express";
import { JwtGuard } from "@/auth/guard";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}
  @Get("test/userlist")
  @UseGuards(JwtGuard)
  getUserList(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.cookie("bitch", "this is value");
    console.log("Cookies:");
    console.log(request.cookies);
    return this.userService.getUserList();
  }
}
