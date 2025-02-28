import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.DATABASE_URI || 'mongodb://localhost:21010/ecommerce', // Lấy giá trị DATABASE_URI từ biến môi trường
      }),
    }),
  ],
})
export class DatabaseModule {}
