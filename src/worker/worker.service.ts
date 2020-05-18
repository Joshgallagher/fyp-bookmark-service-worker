import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class WorkerService {
    @RabbitSubscribe({
        exchange: 'article.exchange',
        routingKey: 'article.deleted',
        queue: 'bookmark-service-queue'
    })
    async deleteRatingsHandler(
        { id }: Record<string, number>
    ): Promise<void> {
    }
}
