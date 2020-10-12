import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ConversionService } from './conversion.service';
import { CreateConversionDto } from './dto/create-conversion.dto';
import { ApiTags } from '@nestjs/swagger';
import { CurrencyType } from './enum/currency-type.enum';

@ApiTags('conversion')
@Controller('conversion')
export class ConversionController {
  constructor(private readonly conversionService: ConversionService) {}

  @Get()
  findAll(@Query() paginationQuery) {
    return this.conversionService.findAll(paginationQuery);
  }

  @Get('convert')
  convert(@Query() createConversionDto: CreateConversionDto) {
    return this.conversionService.convert(createConversionDto);
  }
}
