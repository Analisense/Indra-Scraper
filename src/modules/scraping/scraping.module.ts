import { Module } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ProductsModule } from '../products/products.module';
import { AffiliationsModule } from '../affiliations/affiliations.module';

@Module({
  imports: [ProductsModule, AffiliationsModule],
  providers: [ScrapingService],
  exports: [ScrapingService],
})
export class ScrapingModule {}
