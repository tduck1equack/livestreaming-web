import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request } from "express";
import { JwtGuard } from "@/auth/guard";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}
  @Get("test/userlist")
  @UseGuards(JwtGuard)
  getUserList(@Req() request: Request) {
    console.log(`Console log inside ${this.constructor.name}`);
    console.log(request);
    console.log("Requested user:");
    console.log(request.user);
    return this.userService.getUserList();
  }
}
