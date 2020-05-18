import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Bookmark } from './entities/bookmark.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Bookmark]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        exchanges: [
          {
            name: configService.get<string>('AMQP_EXCHANGE'),
            type: 'topic',
          },
        ],
        uri: configService.get<string>('AMQP_URI'),
        connectionInitOptions: {
          wait: false
        },
      }),
      inject: [ConfigService]
    })
  ],
  providers: [WorkerService]
})
export class WorkerModule { }
