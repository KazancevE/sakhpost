import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ token: string }> {
    const { email, password } = registerDto;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) throw new UnauthorizedException('Email exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ email, password: hashedPassword });

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { token };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result as User;
    }
    return null;
  }

  async login(user: any): Promise<{ token: string }> {
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { token };
  }
}
