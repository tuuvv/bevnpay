import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // Không import JwtService trực tiếp
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: 'your-secret-key', // Mã bí mật JWT
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule], // Xuất JwtModule thay vì JwtService
})
export class AuthModule {}
