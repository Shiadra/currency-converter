import { IsDate, IsEnum, IsNumber } from 'class-validator';
import { CurrencyType } from '../enum/currency-type.enum';

export class ConversionDto {
  @IsEnum(CurrencyType)
  readonly inputCurrency: CurrencyType;

  @IsNumber()
  readonly inputAmount: number;

  @IsEnum(CurrencyType)
  readonly outputCurrency: CurrencyType;

  @IsNumber()
  readonly outputAmount: number;

  @IsDate()
  readonly date: Date;
}
