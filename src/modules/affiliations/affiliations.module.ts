import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AffiliationsService } from './affiliations.service';
import { AffiliationsController } from './affiliations.controller';
import { Affiliation, AffiliationSchema } from './model/affiliations.model';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Affiliation.name, schema: AffiliationSchema },
    ]),
    ProductsModule,
  ],
  controllers: [AffiliationsController],
  providers: [AffiliationsService],
  exports: [AffiliationsService],
})
export class AffiliationsModule {}
