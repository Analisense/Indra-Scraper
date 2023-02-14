import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

export class Participant {
  @Prop()
  name: string;
  @Prop()
  role: string;
}

export class Research {
  @Prop()
  description: string;
  @Prop({ type: [Participant] })
  participant: Participant[];
  @Prop()
  attachment: string[];
}

@Schema()
export class Product {
  @Prop({ type: Number, unique: true })
  id: number;
  @Prop()
  productId: string;
  @Prop()
  prototypeId: string;
  @Prop()
  image: string;
  @Prop()
  title: string;
  @Prop({ type: String, enum: ['prototype', 'product'] })
  type: string;
  @Prop()
  submitter: string;
  @Prop()
  description: string;
  @Prop()
  year: string;
  @Prop({ type: [String] })
  category: string[];
  @Prop({ type: Number })
  tktLevel: number;
  @Prop()
  status: string;
  @Prop({ type: Boolean })
  isValidated: boolean;
  @Prop({ type: Research })
  research: Research;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
