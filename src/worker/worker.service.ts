import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Bookmark } from './entities/bookmark.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WorkerService {
    constructor(
        @InjectRepository(Bookmark)
        private readonly repository: Repository<Bookmark>
    ) { }

    @RabbitSubscribe({
        exchange: 'article.exchange',
        routingKey: 'article.deleted',
        queue: 'bookmark-service-queue'
    })
    async deleteBookmarksHandler(
        { id }: Record<string, number>
    ): Promise<void> {
        const [bookmark, count] = await this.repository
            .findAndCount({ where: { articleId: id } });
        console.log(`BOOKMARK COUNT: ${count}`);
        if (count > 0) {
            await this.repository.delete({ articleId: id });
        }
    }
}
