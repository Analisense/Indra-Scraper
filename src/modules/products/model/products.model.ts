import { Schema, Document } from 'mongoose';

export const PRODUCT = 'Product';

export const ProductSchema = new Schema({
  id: { type: Number, unique: true },
  product_id: String,
  prototype_id: String,
  image: String,
  title: String,
  type: String,
  submitter: String,
  description: String,
  year: String,
  category: Array,
  tkt_level: Number,
  is_validated: Boolean,
  research: {
    description: String,
    participant: [{ name: String, role: String }],
    attachment: Array,
  },
});

export interface Product extends Document {
  id: number;
  product_id: string;
  prototype_id: string;
  image: string;
  title: string;
  type: string;
  submitter: string;
  description: string;
  year: string;
  category: string[];
  tkt_level: number;
  status: string;
  is_validated: boolean;
  research: {
    description: string;
    participant: { name: string; role: string }[];
    attachment: string[];
  };
}
