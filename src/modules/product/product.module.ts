import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product, ProductSchema } from './product.schema';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CategoryModule, // Sử dụng CategoryModule nếu sản phẩm liên kết với danh mục
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
