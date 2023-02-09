import { Schema, Document } from 'mongoose';

export const AFFILIATION = 'Affiliation';

export const AffiliationSchema = new Schema({
  title: String,
});

export interface Affiliation extends Document {
  id: string;
  title: string;
}
