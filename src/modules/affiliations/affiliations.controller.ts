import { ProductsService } from './../products/products.service';
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
import { AffiliationsService } from './affiliations.service';
import { CreateAffiliationDto } from './dto/create-affiliation.dto';
import { UpdateAffiliationDto } from './dto/update-affiliation.dto';
import { load } from 'cheerio';
import axios from 'axios';
import { parseDocument } from 'htmlparser2';
import { BadRequestException, HttpException } from '@nestjs/common/exceptions';

@Controller('affiliations')
export class AffiliationsController {
  constructor(
    private readonly productService: ProductsService,
    private readonly affiliationsService: AffiliationsService, // private readonly axios: HttpService,
  ) {}

  @Post()
  create(@Body() createAffiliationDto: CreateAffiliationDto) {
    return this.affiliationsService.create(createAffiliationDto);
  }

  @Get()
  async findAll() {
    try {
      console.log('Scraping dimulai');
      const { data: affiliationPage } = await axios.get(
        `https://indra.kemdikbud.go.id/Affiliations`,
      );
      const $ = load(parseDocument(affiliationPage));
      if ($('.row .col-md h2').text() === 'Data Not Found')
        throw new BadRequestException();
      const dataPage = $('.col-md-7 .text-start small').text().split(' ');
      const lastPage = +dataPage[3];
      const dataPromise = [];
      for (let page = 1; page <= lastPage; page++) {
        if (page % 10 === 0)
          await new Promise((resolve) => setTimeout(resolve, 10 * 60 * 1000));
        dataPromise.push(this.getAffiliation(page));
      }
      await Promise.all(dataPromise);

      console.log('Scraping selesai');
      return 'selesai';
    } catch (e) {
      console.log('Scraping error');
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAffiliation(page: number) {
    console.log(`Scraping page: ${page}`);
    const { data: affiliationPage } = await axios.get(
      `https://indra.kemdikbud.go.id/Affiliations?page=${page}`,
    );
    const $ = load(parseDocument(affiliationPage));

    const affiliation = await Promise.all(
      $('.row .col-md .item')
        .map(async (_, e) => {
          const id = $(e).find('.ps-4 a').attr('href').split('/').pop();
          return await this.getDetailAffiliation(+id);
        })
        .toArray(),
    );

    console.log(`Success Scraping page: ${page}`);
    return [].concat(...affiliation);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.getDetailAffiliation(+id);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getDetailAffiliation(id: number) {
    console.log(`Scraping id: ${id}`);
    const { data: productPageDetail } = await axios.get(
      `https://indra.kemdikbud.go.id/Affiliations/detail/${id}`,
    );
    const $ = load(parseDocument(productPageDetail));

    const $stat = $('.stat .row');
    const image = $stat.find('.col-md-2 img').attr('src');
    const ptName = $stat.find('.ps-3 a').text().trim();
    const [codePt, acronym, address] = $stat
      .find('.col-md .fs-6')
      .text()
      .split('|');
    const ptCode = codePt.split(':').map((e) => e.trim())[1];
    const total: string[] = [];
    $stat.find('.col-md .d-flex .num-stat').each((_, e) => {
      total.push($(e).text());
    });
    const dataPage = $('.col-md-7 .text-start small').text().split(' ');
    const lastPage = +dataPage[3];
    const dataPromise = [];
    for (let page = 1; page <= lastPage; page++) {
      await new Promise((resolve) => setTimeout(resolve, 3 * 1000));
      dataPromise.push(this.getAllProductId(id, page));
    }
    const products = [].concat(...(await Promise.all(dataPromise)));

    const data = {
      id,
      ptName,
      image,
      ptCode,
      acronym: acronym.trim(),
      address: address.trim(),
      products,
    };

    const affiliation = await this.affiliationsService.findOne(id);
    if (affiliation) {
      await this.affiliationsService.update(id, data);
    } else {
      await this.affiliationsService.create(data);
    }

    console.log(`Success Scraping id: ${id}`);
    return data;
  }

  async getAllProductId(id: number, page: number) {
    console.log(`Scraping id: ${id} - page: ${page}`);
    const { data: productPageDetail } = await axios.get(
      `https://indra.kemdikbud.go.id/Affiliations/detail/${id}?page=${page}`,
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
  update(
    @Param('id') id: string,
    @Body() updateAffiliationDto: UpdateAffiliationDto,
  ) {
    return this.affiliationsService.update(+id, updateAffiliationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.affiliationsService.remove(+id);
  }
}
