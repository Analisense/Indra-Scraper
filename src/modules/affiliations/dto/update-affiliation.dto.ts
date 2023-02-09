import { PartialType } from '@nestjs/swagger';
import { CreateAffiliationDto } from './create-affiliation.dto';

export class UpdateAffiliationDto extends PartialType(CreateAffiliationDto) {}
