"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const common_1 = require("@nestjs/common");
let cachedServer;
async function bootstrapServer() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log'],
    });
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    return app.getHttpAdapter().getInstance();
}
async function handler(req, res) {
    try {
        if (!cachedServer) {
            cachedServer = await bootstrapServer();
        }
        return cachedServer(req, res);
    }
    catch (err) {
        console.error('SERVERLESS BOOTSTRAP ERROR:', err);
        return res.status(500).json({
            error: 'Backend Initialization Error',
            details: err?.message || String(err),
        });
    }
}
//# sourceMappingURL=index.js.map