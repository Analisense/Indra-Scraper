import { Injectable } from '@nestjs/common';
import { CreatePrototypeDto } from './dto/create-prototype.dto';
import { UpdatePrototypeDto } from './dto/update-prototype.dto';

@Injectable()
export class PrototypesService {
  create(createPrototypeDto: CreatePrototypeDto) {
    return 'This action adds a new prototype';
  }

  findAll() {
    return `This action returns all prototypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prototype`;
  }

  update(id: number, updatePrototypeDto: UpdatePrototypeDto) {
    return `This action updates a #${id} prototype`;
  }

  remove(id: number) {
    return `This action removes a #${id} prototype`;
  }
}
