import { Injectable } from '@nestjs/common';
import { CreateAffiliationDto } from './dto/create-affiliation.dto';
import { UpdateAffiliationDto } from './dto/update-affiliation.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Affiliation, AffiliationDocument } from './model/affiliations.model';

@Injectable()
export class AffiliationsService {
  constructor(
    @InjectModel(Affiliation.name)
    private readonly affiliationModel: Model<AffiliationDocument>,
  ) {}

  async create(createAffiliationDto: CreateAffiliationDto) {
    const affiliation = new this.affiliationModel(createAffiliationDto);
    return await affiliation.save();
  }

  findAll() {
    return `This action returns all affiliations`;
  }

  findOne(id: number) {
    return this.affiliationModel.findOne({ id });
  }

  update(id: number, updateAffiliationDto: CreateAffiliationDto) {
    return this.affiliationModel.updateOne({ id }, updateAffiliationDto);
  }

  remove(id: number) {
    return `This action removes a #${id} affiliation`;
  }
}
