import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { load } from 'cheerio';
import { parseDocument } from 'htmlparser2';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ScrapingService {
  constructor(private readonly productService: ProductsService) {}

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
}
