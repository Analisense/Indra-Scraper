import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AffiliationsService } from './affiliations.service';
import { CreateAffiliationDto } from './dto/create-affiliation.dto';
import { UpdateAffiliationDto } from './dto/update-affiliation.dto';
import { load } from 'cheerio';
import axios from 'axios';
import { parseDocument } from 'htmlparser2';

@Controller('affiliations')
export class AffiliationsController {
  constructor(
    private readonly affiliationsService: AffiliationsService, // private readonly axios: HttpService,
  ) {}

  @Post()
  create(@Body() createAffiliationDto: CreateAffiliationDto) {
    return this.affiliationsService.create(createAffiliationDto);
  }

  @Get()
  async findAll() {
    const { data: affiliationPage } = await axios.get(
      `https://indra.kemdikbud.go.id/Affiliations`,
    );
    const $ = load(parseDocument(affiliationPage));
    const dataPage = $('.col-md-7 .text-start small').text().split(' ');
    const lastPage = +dataPage[3];

    const data = [];
    $('.row .col-md .item').each((_, e) => {
      const id = $(e).find('.ps-4 a').attr().href.split('/').pop();
      const image = $(e).find('.col-md-2 img').attr().src;
      const pt_name = $(e).find('.ps-4 a').text().trim();
      const [codePt, acronim, address] = $(e)
        .find('.ms-lg-2 .fs-6')
        .text()
        .trim()
        .split('|');
      const code_pt = codePt.split(':').map((e) => e.trim())[1];
      const total: string[] = [];
      $(e)
        .find('.ms-lg-2 .d-flex .num-stat')
        .each((_, e) => {
          total.push($(e).text());
        });
      data.push({
        id,
        pt_name,
        image,
        code_pt,
        acronim: acronim.trim(),
        address: address.trim(),
        total_author: +total[0].replace(',', ''),
        total_department: +total[1].replace(',', ''),
        total_prototype: +total[2].replace(',', ''),
        total_product: +total[3].replace(',', ''),
      });
    });

    return data;
  }

  async getAffiliation(page: number) {
    const { data: affiliationPage } = await axios.get(
      `https://indra.kemdikbud.go.id/Affiliations?page=${page}`,
    );
    const $ = load(parseDocument(affiliationPage));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.affiliationsService.findOne(+id);
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
