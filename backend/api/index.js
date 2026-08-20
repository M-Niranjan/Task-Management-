require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { ValidationPipe } = require('@nestjs/common');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

const server = express();

// Enable basic CORS at Express level first so even errors or preflights get CORS headers
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Add a root health check so GET / or GET /api/health always returns 200 OK immediately
server.get(['/', '/api/health', '/health'], (req, res) => {
  res.json({
    status: 'ok',
    message: 'NestJS Task Management Backend is running!',
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
  } catch (err) {
    bootError = {
      message: err?.message || String(err),
      name: err?.name,
      stack: err?.stack,
    };
    console.error('BOOTSTRAP ERROR:', err);
    throw err;
  }
}

module.exports = async function handler(req, res) {
  // Always set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // If bootstrap already failed previously, return the boot error directly
  if (bootError) {
    return res.status(500).json({
      error: 'NestJS Bootstrap Failed Previously',
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
        error: 'NestJS Bootstrap Failed',
        message: err?.message || String(err),
        stack: err?.stack,
      });
    }
  }

  return server(req, res);
};
