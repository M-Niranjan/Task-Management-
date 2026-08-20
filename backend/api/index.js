require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { ValidationPipe } = require('@nestjs/common');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

const server = express();

// Global process error safety guards to prevent Lambda process termination
process.on('unhandledRejection', (reason) => {
  console.error('SERVERLESS UNHANDLED REJECTION:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('SERVERLESS UNCAUGHT EXCEPTION:', err);
});

// Enable CORS for all incoming requests including OPTIONS preflight
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
let bootError = null;

async function bootstrap() {
  try {
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
    console.log('✅ NestJS serverless application initialized successfully');
  } catch (err) {
    bootError = {
      message: err && err.message ? err.message : String(err),
      name: err && err.name ? err.name : 'Error',
      stack: err && err.stack ? err.stack : undefined,
    };
    console.error('❌ NestJS bootstrap error:', err);
    throw err;
  }
}

module.exports = async function handler(req, res) {
  // CORS fallback headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check fast-path if root
  if (req.url === '/' || req.url === '/health' || req.url === '/api/health') {
    return res.status(200).json({
      status: 'ok',
      message: 'NestJS Task Management Backend is active and running!',
      timestamp: new Date().toISOString(),
    });
  }

  if (bootError) {
    return res.status(500).json({
      error: 'NestJS Bootstrap Error',
      bootError,
    });
  }

  if (!isReady) {
    if (!bootPromise) {
      bootPromise = bootstrap().catch((err) => {
        bootPromise = null;
      });
    }
    try {
      await bootPromise;
    } catch (err) {
      return res.status(500).json({
        error: 'NestJS Bootstrap Error',
        message: err && err.message ? err.message : String(err),
        stack: err && err.stack ? err.stack : undefined,
      });
    }
  }

  return server(req, res);
};
