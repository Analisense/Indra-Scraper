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
  product_id?: string;
  prototype_id?: string;
  image: string;
  title: string;
  submitter?: string;
  description?: string;
  type: string;
  year: string;
  category: string[];
  tkt_level: number;
  status: string;

  @Type(() => Research)
  research: Research;
}
