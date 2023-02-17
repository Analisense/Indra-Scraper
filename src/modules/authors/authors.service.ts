import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Author, AuthorDocument } from './model/authors.model';
import { Model } from 'mongoose';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name)
    private readonly authorModel: Model<AuthorDocument>,
  ) {}

  create(createAuthorDto: CreateAuthorDto) {
    const author = new this.authorModel(createAuthorDto);
    return author.save();
  }

  findAll() {
    return `This action returns all authors`;
  }

  findOne(id: number) {
    return this.authorModel.findOne({ id });
  }

  update(id: number, updateAuthorDto: CreateAuthorDto) {
    return this.authorModel.updateOne({ id }, updateAuthorDto);
  }

  remove(id: number) {
    return `This action removes a #${id} author`;
  }
}
