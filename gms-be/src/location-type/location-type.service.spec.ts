import { Test, TestingModule } from '@nestjs/testing';
import { LocationTypeService } from './location-type.service';

describe('LocationTypeService', () => {
  let service: LocationTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationTypeService],
    }).compile();

    service = module.get<LocationTypeService>(LocationTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
