"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const server = (0, express_1.default)();
let isReady = false;
let bootPromise = null;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server), { logger: ['error', 'warn', 'log'] });
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
}
async function handler(req, res) {
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
    }
    catch (err) {
        console.error('SERVERLESS HANDLER ERROR:', err);
        return res.status(500).json({
            error: 'Backend Execution Error',
            message: err?.message || String(err),
        });
    }
}
//# sourceMappingURL=index.js.map