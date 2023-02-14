import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './model/products.model';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const product = new this.productModel(createProductDto);
    return product.save();
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return this.productModel.findOne({ id });
  }

  update(id: number, updateProductDto: CreateProductDto) {
    return this.productModel.findOneAndUpdate({ id }, updateProductDto);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
