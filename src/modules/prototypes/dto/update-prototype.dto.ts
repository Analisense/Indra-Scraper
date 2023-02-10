import { PartialType } from '@nestjs/swagger';
import { CreatePrototypeDto } from './create-prototype.dto';

export class UpdatePrototypeDto extends PartialType(CreatePrototypeDto) {}
