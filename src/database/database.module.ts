import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_staging', // Lấy giá trị DATABASE_URI từ biến môi trường
      }),
    }),
  ],
})
export class DatabaseModule {}
