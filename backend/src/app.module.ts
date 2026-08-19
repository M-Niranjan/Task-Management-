import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://niranjanmathapati65_db_user:k1N8zVLszsbmddLl@cluster0.fw4faax.mongodb.net/taskmanager?appName=Cluster0',
      {
        serverSelectionTimeoutMS: 5000,
      },
    ),
    AuthModule,
    TasksModule,
    ProjectsModule,
  ],
})
export class AppModule {}
