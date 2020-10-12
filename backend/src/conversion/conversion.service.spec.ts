import { Test, TestingModule } from '@nestjs/testing';
import { ConversionService } from './conversion.service';
import { HttpModule, HttpService } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Conversion } from './entities/conversion.entity';
import conversionConfig from './config/conversion.config';
import { Repository } from 'typeorm';
import { of } from 'rxjs';
import { CreateConversionDto } from './dto/create-conversion.dto';
import { CurrencyType } from './enum/currency-type.enum';
import { AxiosResponse } from 'axios';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});


describe('ConversionService', () => {
  let service: ConversionService;
  let httpService: HttpService;
  let conversionRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        ConversionService,
        { provide: conversionConfig.KEY, useValue: {} },
        { provide: getRepositoryToken(Conversion), useValue: createMockRepository<Conversion>() },
      ],
    }).compile();

    service = module.get<ConversionService>(ConversionService);
    httpService = module.get<HttpService>(HttpService);
    conversionRepository = module.get<MockRepository>(getRepositoryToken(Conversion));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all conversion objects', async () => {
      const expectedConversions = [
        {},
      ];

      conversionRepository.find.mockReturnValue(expectedConversions);
      const conversions = await service.findAll({ limit: 10, offset: 0 });
      expect(conversions).toEqual(expectedConversions);
    });
  });

  describe('convert', () => {
    it('should convert the currency', async () => {
      const createConversionDto: CreateConversionDto = {
        inputCurrency: CurrencyType.EURO,
        inputAmount: 3.67,
        outputCurrency: CurrencyType.DOLLAR,
      }

      const exchangeRate = 0.85;
      const exchangeRateAnswer: AxiosResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: {},
      };
      exchangeRateAnswer.data[`${createConversionDto.inputCurrency}_${createConversionDto.outputCurrency}`] = exchangeRate;
      const expectedOutputAmount = createConversionDto.inputAmount * exchangeRate

      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(exchangeRateAnswer));
      conversionRepository.create.mockImplementation((input: CreateConversionDto) => input);
      conversionRepository.save.mockImplementation((input: Conversion) => input);

      const conversionResult = await service.convert(createConversionDto);
      const conversion = await conversionResult.toPromise();

      expect(conversionRepository.create).toBeCalledWith(expect.objectContaining({
        outputAmount: expectedOutputAmount,
        date: expect.any(Date),
      }));
      expect(conversion.outputAmount).toEqual(expectedOutputAmount);
      expect(conversion.date instanceof Date).toBe(true);
    });
  });
});
