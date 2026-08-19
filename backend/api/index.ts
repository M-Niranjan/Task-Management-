import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let isReady = false;
let bootPromise: Promise<void> | null = null;

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
    { logger: ['error', 'warn', 'log'] },
  );
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
}

export default async function handler(req: any, res: any) {
  try {
    if (!isReady) {
      if (!bootPromise) {
        bootPromise = bootstrap().then(() => {
          isReady = true;
        });
      }
      await bootPromise;
    }
    return server(req, res);
  } catch (err: any) {
    console.error('SERVERLESS HANDLER ERROR:', err);
    return res.status(500).json({
      error: 'Backend Execution Error',
      message: err?.message || String(err),
    });
  }
}
