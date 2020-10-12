import { HttpServer, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { ConversionModule } from '../../src/conversion/conversion.module';
import { CreateConversionDto } from '../../src/conversion/dto/create-conversion.dto';
import { CurrencyType } from '../../src/conversion/enum/currency-type.enum';
import { ConfigModule } from '@nestjs/config';

describe('[Feature] Conversion - /conversion', () => {
  let app: INestApplication;
  let httpServer: HttpServer;

  const createConversionDto: CreateConversionDto = {
    inputCurrency: CurrencyType.EURO,
    inputAmount: 13,
    outputCurrency: CurrencyType.YEN,
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConversionModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
    httpServer = app.getHttpServer();
  });

  it('Get convert [GET /convert]', () => {
    return request(httpServer)
      .get(`/conversion/convert?inputCurrency=${createConversionDto.inputCurrency}&outputCurrency=${createConversionDto.outputCurrency}&inputAmount=${createConversionDto.inputAmount}`)
      .then(({ body }) => {
        expect(body).toEqual(jasmine.objectContaining({
          ...createConversionDto,
          outputAmount: jasmine.any(Number),
          date: jasmine.any(String),
        }))
      })
  });

  it('Get convert [GET /convert] with invalid currency should Fail', () => {
    return request(httpServer)
      .get(`/conversion/convert?inputCurrency=XXX&outputCurrency=${createConversionDto.outputCurrency}&inputAmount=${createConversionDto.inputAmount}`)
      .then(({ body }) => {
        expect(body).toEqual(jasmine.objectContaining({
          statusCode: 400,
          error: 'Bad Request',
          message: ['inputCurrency must be a valid enum value'],
        }))
      })
  });

  it('Get all [GET /]', () => {
    return request(httpServer)
      .get(`/conversion`)
      .then(({ body }) => {
        expect(body.length).toBeGreaterThan(0);
        expect(body[0]).toEqual(jasmine.objectContaining({
          ...createConversionDto,
          outputAmount: jasmine.any(Number),
          date: jasmine.any(String),
        }))
      })
  });

  afterAll(async () => {
    await app.close();
  });
});
