import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async loginAsGuest() {
    const guestEmail = `guest-${Date.now()}@pyramid.app`;
    const user = await this.userModel.create({
      name: 'Dexter',
      email: guestEmail,
      initials: 'DX',
      isGuest: true,
    });

    const token = this.jwtService.sign({ sub: user._id, email: user.email });
    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        initials: user.initials,
        isGuest: user.isGuest,
      },
      token,
    };
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }
}
