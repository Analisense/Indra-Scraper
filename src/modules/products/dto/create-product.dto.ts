import { Type } from 'class-transformer';

export class Participant {
  name?: string;
  role?: string;
}

export class Research {
  description?: string;
  @Type(() => Participant)
  participant?: Participant[];
  attachment?: string[];
}

export class CreateProductDto {
  id: number;
  productId?: string;
  prototypeId?: string;
  image: string;
  title: string;
  submitter?: string;
  description?: string;
  type: string;
  year: string;
  category: string[];
  tktLevel: number;
  isValidated: boolean;

  @Type(() => Research)
  research: Research;
}
