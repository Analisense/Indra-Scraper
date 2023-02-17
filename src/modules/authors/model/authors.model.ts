import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/modules/products/model/products.model';

export type AuthorDocument = HydratedDocument<Author>;

@Schema()
export class Author {
  @Prop({ type: Number, unique: true })
  id: number;
  @Prop()
  name: string;
  @Prop()
  image: string;
  @Prop()
  institution: string;
  @Prop()
  studyProgram: string;
  @Prop({ type: [Types.ObjectId], ref: Product.name })
  products: Product[];
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
