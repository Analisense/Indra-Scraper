import { parseDocument } from 'htmlparser2';
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
import { PrototypesService } from './prototypes.service';
import { CreatePrototypeDto } from './dto/create-prototype.dto';
import { UpdatePrototypeDto } from './dto/update-prototype.dto';
import axios from 'axios';
import { load } from 'cheerio';
import { ProductsService } from '../products/products.service';
import { NotFoundException, HttpException } from '@nestjs/common/exceptions';

@Controller('prototypes')
export class PrototypesController {
  constructor(
    private readonly prototypesService: PrototypesService,
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  create(@Body() createPrototypeDto: CreatePrototypeDto) {
    return this.prototypesService.create(createPrototypeDto);
  }

  @Get()
  async findAll() {
    try {
      console.log('Scraping dimulai');
      const { data: prototypePage } = await axios.get(
        `https://indra.kemdikbud.go.id/Prototype?page=1`,
      );
      const $ = load(parseDocument(prototypePage));
      const dataPage = $('.col-md-7 .text-start small').text().split(' ');
      const lastPage = +dataPage[3];
      const dataPromise = [];
      for (let page = 1; page <= lastPage; page++) {
        if (page % 10 === 0)
          await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
        dataPromise.push(this.getPrototype(page));
      }
      await Promise.all(dataPromise);

      console.log('Scraping selesai');
      return 'selesai';
    } catch (e) {
      console.log('Scraping error');
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getPrototype(page: number) {
    console.log(`Scraping page: ${page}`);
    const { data: prototypePage } = await axios.get(
      `https://indra.kemdikbud.go.id/Prototype?page=${page}`,
    );
    const $ = load(parseDocument(prototypePage));

    const prototype = await Promise.all(
      $('.row .col-md .item')
        .map(async (_, e) => {
          const $ps4 = $(e).find('.ps-4');
          const id = +$ps4.find('a').attr('href').split('/').pop();
          return await this.getDetailPrototype(+id);
        })
        .toArray(),
    );

    console.log(`Success Scraping page: ${page}`);
    return [].concat(...prototype);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return this.getDetailPrototype(+id);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getDetailPrototype(id: number) {
    console.log(`Scraping id: ${id}`);
    const { data: prototypePageDetail } = await axios.get(
      `https://indra.kemdikbud.go.id/Prototype/detail/${id}`,
    );

    const $ = load(parseDocument(prototypePageDetail));

    const $banner = $('.banner');
    const $stat = $banner.find('.stat .row');
    const $bb = $banner.find('.border-bottom.p-4.bg-light');
    const $p3 = $banner.find('.row.m-0 .col-md.bg-light.border-bottom.p-3');
    const $bs = $banner.find(
      '.row.m-0 .col-md-4.bg-light.border-bottom.border-start.p-3',
    );
    const $ps4 = $stat.find('.col.ps-4.pe-3.py-2.text-lg-start.text-sm-center');
    const $mt2 = $ps4.find('.mt-2');
    const $fs5 = $mt2.find('.fs-5');

    const prototypeId = $ps4.find('.fs-6 .fw-bold').text();
    if (!prototypeId) {
      throw new NotFoundException();
    }
    const image = $stat.find('.col-md-3 img').attr('src');
    const [type, , year] = $ps4
      .find('.fs-6.text-muted')
      .text()
      .split('-')
      .map((e) => e.trim());
    const submitter = $ps4
      .find('.fs-6.text-muted.mt-2.mb-3')
      .text()
      .split(':')[1]
      .trim();
    const title = $ps4.find('a').text().trim();
    const category = $fs5.find('.me-2').text().split('/');
    const tktLevel = +$fs5.find('.badge').text().split(':').pop().trim();
    const status = $mt2
      .find('.fs-6')
      .text()
      .replace(/\r\n/g, '')
      .split(',')
      .pop()
      .trim();
    const description = $bb.find('p').text().replace(/\r\n/g, '');
    const attachment = [];
    $bs.find('li.list-group-item').each((_, e) => {
      attachment.push($(e).find('a').attr('href'));
    });
    const participant = [];
    $p3.find('.mt-3 .list-group li').each((_, e) => {
      participant.push({
        name: $(e)
          .find('div')
          .text()
          .replace(/\r\n/g, '')
          .replace('Leader', '')
          .replace('Member', '')
          .trim(),
        role: $(e).find('div small').text().toLowerCase(),
      });
    });
    const research = {
      description: $p3.find('.mt-3 .d-flex p').text().replace(/\r\n/g, ''),
      participant,
      attachment,
    };

    const data = {
      id: +id,
      prototypeId,
      image,
      title,
      type: type.toLowerCase(),
      category,
      submitter,
      year: year.split(' ').at(0),
      tktLevel,
      isValidated: status === 'Validated',
      description,
      research,
    };

    const prototype = await this.productsService.findOne(+id);
    if (prototype) {
      await this.productsService.update(+id, data);
    } else {
      await this.productsService.create(data);
    }

    console.log(`Success Scraping id: ${id}`);
    return data;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePrototypeDto: UpdatePrototypeDto,
  ) {
    return this.prototypesService.update(+id, updatePrototypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prototypesService.remove(+id);
  }
}
