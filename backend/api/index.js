require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { ValidationPipe } = require('@nestjs/common');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

const server = express();
let isReady = false;
let bootPromise = null;

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

module.exports = async function handler(req, res) {
  try {
    if (!isReady) {
      if (!bootPromise) {
        bootPromise = bootstrap().then(() => {
          isReady = true;
        }).catch((err) => {
          bootPromise = null;
          throw err;
        });
      }
      await bootPromise;
    }
    return server(req, res);
  } catch (err) {
    console.error('SERVERLESS HANDLER ERROR:', err);
    return res.status(500).json({
      error: 'Backend Execution Error',
      message: err && err.message ? err.message : String(err),
      stack: err && err.stack ? err.stack : undefined,
    });
  }
};
