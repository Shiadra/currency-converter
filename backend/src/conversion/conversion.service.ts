import { HttpService, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversion } from './entities/conversion.entity';
import { Repository } from 'typeorm';
import { CreateConversionDto } from './dto/create-conversion.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import conversionConfig from './config/conversion.config';
import { ConfigType } from '@nestjs/config';
import { ConversionDto } from './dto/conversion.dto';
import { map } from 'rxjs/operators';

@Injectable()
export class ConversionService {
  constructor(
    @InjectRepository(Conversion)
    private readonly conversionRepository: Repository<Conversion>,
    private readonly httpService: HttpService,
    @Inject(conversionConfig.KEY)
    private readonly conversionConfiguration: ConfigType<typeof conversionConfig>
  ) {
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.conversionRepository.find({
      skip: offset || 0,
      take: limit || 10,
      order: {
        date: 'DESC',
      },
    });
  }

  async convert(createConversionDto: CreateConversionDto) {
    const currencyPair = `${createConversionDto.inputCurrency}_${createConversionDto.outputCurrency}`;
    return this.httpService.get(`${this.conversionConfiguration.endpoint}?apiKey=${this.conversionConfiguration.appKey}&compact=ultra&q=${currencyPair}`).pipe(
      map(response => this.createHistory({
        ...createConversionDto,
        outputAmount: createConversionDto.inputAmount * response.data[currencyPair],
        date: new Date(),
      }))
    );
  }

  private createHistory(conversionDto: ConversionDto) {
    const conversion = this.conversionRepository.create(conversionDto);
    return this.conversionRepository.save(conversion);
  }
}
