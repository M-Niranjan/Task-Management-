import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { AllExceptionsFilter } from './http-exception.filter';

const MONGODB_URI_FALLBACK =
  'mongodb+srv://niranjanmathapati65_db_user:k1N8zVLszsbmddLl@cluster0.fw4faax.mongodb.net/taskmanager?appName=Cluster0';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || MONGODB_URI_FALLBACK,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      }),
    }),
    AuthModule,
    TasksModule,
    ProjectsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
