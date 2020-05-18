import { Module } from '@nestjs/common';
import { WorkerModule } from './worker/worker.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test'
        ? '.env.test'
        : '.env'
    }),
    WorkerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
