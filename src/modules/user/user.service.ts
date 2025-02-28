import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Tạo người dùng mới
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return user.save();
  }

  // Tìm người dùng theo tên đăng nhập và mật khẩu (Xác thực đăng nhập)
  async findByCredentials(loginDto: LoginDto): Promise<UserDocument> {
    const { username, password } = loginDto;

    // Tìm người dùng trong cơ sở dữ liệu theo tên đăng nhập
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); // Sử dụng UnauthorizedException
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  // Tìm người dùng theo ID
  async findOne(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }
}
