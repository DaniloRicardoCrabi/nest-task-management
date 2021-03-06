import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  //chamada do modulo,
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    TasksModule,
    AuthModule],

})
export class AppModule {}
