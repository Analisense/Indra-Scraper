import { Test, TestingModule } from '@nestjs/testing';
import { PrototypesController } from './prototypes.controller';
import { PrototypesService } from './prototypes.service';

describe('PrototypesController', () => {
  let controller: PrototypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrototypesController],
      providers: [PrototypesService],
    }).compile();

    controller = module.get<PrototypesController>(PrototypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
