import { HttpModule, Module } from '@nestjs/common';
import { ConversionController } from './conversion.controller';
import { ConversionService } from './conversion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversion } from './entities/conversion.entity';
import { ConfigModule } from '@nestjs/config';
import conversionConfig from './config/conversion.config';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Conversion]),
    ConfigModule.forFeature(conversionConfig)
  ],
  controllers: [ConversionController],
  providers: [ConversionService]
})
export class ConversionModule {}
