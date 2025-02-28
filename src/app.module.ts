import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './database/database.module';
import { CartModule } from './modules/cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load biến môi trường từ .env
    CartModule,
    DatabaseModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    UserModule,
  ],
})
export class AppModule {}
