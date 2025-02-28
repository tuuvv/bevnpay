import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Đăng ký người dùng mới
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }


  // Lấy thông tin người dùng
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
