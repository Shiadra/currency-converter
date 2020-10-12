import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CurrencyType } from '../enum/currency-type.enum';
import { ColumnNumericTransformer } from '../../common/transformer/column-numeric.transformer';

@Entity()
export class Conversion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: CurrencyType
  })
  inputCurrency: CurrencyType;

  @Column({
    type: 'numeric',
    precision: 100,
    scale: 4,
    transformer: new ColumnNumericTransformer(),
  })
  inputAmount: number;

  @Column({
    type: 'enum',
    enum: CurrencyType
  })
  outputCurrency: CurrencyType;

  @Column({
    type: 'numeric',
    precision: 100,
    scale: 4,
    transformer: new ColumnNumericTransformer(),
  })
  outputAmount: number;

  @Column()
  date: Date;
}
