import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { CurrencyType } from '../enum/currency-type.enum';

export class CreateConversionDto {
  @IsEnum(CurrencyType)
  readonly inputCurrency: CurrencyType;

  @IsNumber()
  readonly inputAmount: number;

  @IsEnum(CurrencyType)
  readonly outputCurrency: CurrencyType;
}
