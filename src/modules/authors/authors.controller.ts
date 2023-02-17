import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { load } from 'cheerio';
import axios from 'axios';
import { parseDocument } from 'htmlparser2';
import { NotFoundException, HttpException } from '@nestjs/common/exceptions';
import { ProductsService } from '../products/products.service';

@Controller('authors')
export class AuthorsController {
  constructor(
    private readonly authorsService: AuthorsService,
    private readonly productService: ProductsService,
  ) {}

  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @Get()
  async findAll() {
    try {
      console.log('Scraping dimulai');
      const { data: productPage } = await axios.get(
        `https://indra.kemdikbud.go.id/Authors?page=1`,
      );
      const $ = load(parseDocument(productPage));
      const dataPage = $('.col-md-7 .text-start small').text().split(' ');
      const lastPage = +dataPage[3];
      const dataPromise = [];
      for (let page = 1; page <= lastPage; page++) {
        if (page % 10 === 0)
          await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
        dataPromise.push(this.getAuthor(page));
      }
      await Promise.all(dataPromise);

      console.log('Scraping selesai');
      return 'selesai';
    } catch (e) {
      console.log('Scraping error');
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAuthor(page: number) {
    console.log(`Scraping page: ${page}`);
    const { data: authorPage } = await axios.get(
      `https://indra.kemdikbud.go.id/Authors?page=${page}`,
    );
    const $ = load(parseDocument(authorPage));

    const author = await Promise.all(
      $('.row .col-md .item')
        .map(async (_, e) => {
          const id = $(e).find('.ps-2 a').attr('href').split('/').pop();
          return await this.getDetailAuthor(+id);
        })
        .toArray(),
    );

    console.log(`Success Scraping page: ${page}`);
    return [].concat(...author);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      console.log('Scraping dimulai');
      const author = await this.getDetailAuthor(+id);
      console.log('Scraping selesai');
      return author;
    } catch (e) {
      console.log('Scraping error');
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getDetailAuthor(id: number) {
    console.log(`Scraping id: ${id}`);
    const { data: authorPageDetail } = await axios.get(
      `https://indra.kemdikbud.go.id/Authors/detail/${id}`,
    );
    const $ = load(parseDocument(authorPageDetail));

    const $stat = $('.stat .row');
    const image = $stat.find('.col-md-2 img').attr('src');
    const name = $stat.find('.ps-2 a').text().trim();
    const [institution, studyProgram] = $stat
      .find('.ps-2 .pt-3')
      .text()
      .trim()
      .split('  ');
    const total: string[] = [];
    $stat.find('.ps-2 .d-flex .num-stat').each((_, e) => {
      total.push($(e).text());
    });
    const dataPage = $('.col-md-7 .text-start small').text().split(' ');
    const lastPage = +dataPage[3];
    const dataPromise = [];
    for (let page = 1; page <= lastPage; page++) {
      if (page % 50 === 0)
        await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
      dataPromise.push(this.getAllProductId(id, page));
    }
    const products = [].concat(...(await Promise.all(dataPromise)));

    const data = {
      id,
      name,
      image,
      institution,
      studyProgram,
      products,
    };

    const author = await this.authorsService.findOne(id);
    if (author) {
      await this.authorsService.update(id, data);
    } else {
      await this.authorsService.create(data);
    }

    console.log(`Success Scraping id: ${id}`);
    return data;
  }

  async getAllProductId(id: number, page: number) {
    console.log(`Scraping id: ${id} - page: ${page}`);
    const { data: productPageDetail } = await axios.get(
      `https://indra.kemdikbud.go.id/Authors/detail/${id}?page=${page}`,
    );
    const $ = load(parseDocument(productPageDetail));
    const products = [].concat(
      ...(await Promise.all(
        $('.row .col-md .item')
          .map(async (_, e) => {
            const id = $(e).find('.ps-4 a').attr('href').split('/').pop();
            const product = await this.productService.findOne(+id);
            if (product) return product._id;
          })
          .toArray(),
      )),
    );
    console.log(`Success Scraping id: ${id} - page: ${page}`);
    return products;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorsService.update(+id, updateAuthorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorsService.remove(+id);
  }
}
