import { Test, TestingModule } from '@nestjs/testing';
import { WorkerService } from './worker.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DiscoveryService } from '@nestjs/core';
import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Bookmark } from './entities/bookmark.entity';
import { Repository } from 'typeorm';

describe('WorkerService', () => {
  let service: WorkerService;
  let repository: Repository<Bookmark>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscoveryService,
        AmqpConnection,
        RabbitMQModule,
        WorkerService,
        {
          provide: getRepositoryToken(Bookmark),
          useValue: {
            findAndCount: jest.fn(),
            delete: jest.fn(),
          }
        }
      ],
    }).compile();

    service = module.get<WorkerService>(WorkerService);
    repository = module.get<Repository<Bookmark>>(getRepositoryToken(Bookmark));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteBookmarksHandler', () => {
    const data: Record<string, number> = { id: 1 };

    it('Bookmarks can be deleted if one or more exist', async () => {
      repository.findAndCount = jest.fn().mockResolvedValue([{}, 4]);

      await service.deleteBookmarksHandler(data);

      expect(repository.findAndCount).toHaveBeenCalledWith({ where: { articleId: data.id } });
      expect(repository.delete).toHaveBeenCalledWith({ articleId: data.id });
    });

    it('Bookmarks can not be deleted if none exist', async () => {
      repository.findAndCount = jest.fn().mockResolvedValue([{}, 0]);

      await service.deleteBookmarksHandler(data);

      expect(repository.findAndCount).toHaveBeenCalledWith({ where: { articleId: data.id } });
      expect(repository.delete).toHaveBeenCalledTimes(0);
    });
  });
});
