import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user: any = await this.userService.findByCredentials(loginDto);
    const payload = { username: user?.username, sub: user?._id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(registerDto: RegisterDto) {
    return this.userService.create(registerDto);
  }
}
