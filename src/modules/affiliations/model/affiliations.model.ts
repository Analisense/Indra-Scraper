import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/modules/products/model/products.model';

export type AffiliationDocument = HydratedDocument<Affiliation>;

@Schema()
export class Affiliation {
  @Prop({ type: Number, unique: true })
  id: number;
  @Prop()
  ptName: string;
  @Prop()
  ptCode: string;
  @Prop()
  acronym: string;
  @Prop()
  address: string;
  @Prop({ type: [Types.ObjectId], ref: Product.name })
  products: Product[];
}

export const AffiliationSchema = SchemaFactory.createForClass(Affiliation);
