import { Module } from '@nestjs/common';
import { PrototypesService } from './prototypes.service';
import { PrototypesController } from './prototypes.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [PrototypesController],
  providers: [PrototypesService],
})
export class PrototypesModule {}
