require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { ValidationPipe } = require('@nestjs/common');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

const server = express();

// Global process error safety guards
process.on('unhandledRejection', (reason) => {
  console.error('SERVERLESS UNHANDLED REJECTION:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('SERVERLESS UNCAUGHT EXCEPTION:', err);
});

// Middleware: Always append CORS headers to all requests and responses
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Root endpoints for instant health validation
server.get(['/', '/health', '/api/health'], (req, res) => {
  res.json({
    status: 'ok',
    message: 'NestJS Task Management Backend is active and running!',
    timestamp: new Date().toISOString(),
  });
});

let isReady = false;
let bootPromise = null;

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
    { logger: ['error', 'warn', 'log'] },
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Accept',
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
  isReady = true;
  console.log('✅ NestJS application ready');
}

module.exports = async function handler(req, res) {
  // Always ensure CORS headers are set on the outgoing response
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check fast path
  if (req.url === '/' || req.url === '/health' || req.url === '/api/health') {
    return res.status(200).json({
      status: 'ok',
      message: 'NestJS Task Management Backend is active and running!',
      timestamp: new Date().toISOString(),
    });
  }

  try {
    if (!isReady) {
      if (!bootPromise) {
        bootPromise = bootstrap().catch((err) => {
          bootPromise = null;
          throw err;
        });
      }
      await bootPromise;
    }
    return server(req, res);
  } catch (err) {
    console.error('HANDLER ERROR:', err);
    return res.status(500).json({
      error: 'Backend Initialization Error',
      message: err && err.message ? err.message : String(err),
    });
  }
};
