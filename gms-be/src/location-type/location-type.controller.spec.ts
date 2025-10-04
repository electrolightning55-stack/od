import { Test, TestingModule } from '@nestjs/testing';
import { LocationTypeController } from './location-type.controller';

describe('LocationTypeController', () => {
  let controller: LocationTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationTypeController],
    }).compile();

    controller = module.get<LocationTypeController>(LocationTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
