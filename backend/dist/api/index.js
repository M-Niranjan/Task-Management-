"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const common_1 = require("@nestjs/common");
let cachedServer;
async function bootstrapServer() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    return app.getHttpAdapter().getInstance();
}
async function handler(req, res) {
    if (!cachedServer) {
        cachedServer = await bootstrapServer();
    }
    return cachedServer(req, res);
}
//# sourceMappingURL=index.js.map