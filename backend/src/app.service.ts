import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: 'ok',
      message: 'Pyramid Task Management Backend API is running successfully!',
      timestamp: new Date().toISOString(),
    };
  }
}
