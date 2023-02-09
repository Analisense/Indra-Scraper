import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PRODUCT, ProductSchema } from './model/products.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PRODUCT, schema: ProductSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
