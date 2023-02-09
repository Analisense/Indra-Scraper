import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AffiliationsService } from './affiliations.service';
import { AffiliationsController } from './affiliations.controller';
import { AFFILIATION, AffiliationSchema } from './model/affiliations.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AFFILIATION, schema: AffiliationSchema },
    ]),
  ],
  controllers: [AffiliationsController],
  providers: [AffiliationsService],
  exports: [AffiliationsService],
})
export class AffiliationsModule {}
