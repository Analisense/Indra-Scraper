import { Injectable } from '@nestjs/common';
import { CreateAffiliationDto } from './dto/create-affiliation.dto';
import { UpdateAffiliationDto } from './dto/update-affiliation.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AFFILIATION, Affiliation } from './model/affiliations.model';

@Injectable()
export class AffiliationsService {
  constructor(
    @InjectModel(AFFILIATION)
    private readonly affiliationModel: Model<Affiliation>,
  ) {}

  async create(createAffiliationDto: CreateAffiliationDto) {
    const affiliation = new this.affiliationModel({
      title: 'tes',
    });
    await affiliation.save();
    return 'This action adds a new affiliation';
  }

  findAll() {
    return `This action returns all affiliations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} affiliation`;
  }

  update(id: number, updateAffiliationDto: UpdateAffiliationDto) {
    return `This action updates a #${id} affiliation`;
  }

  remove(id: number) {
    return `This action removes a #${id} affiliation`;
  }
}
