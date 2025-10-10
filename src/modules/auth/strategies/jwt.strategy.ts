import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserStatus } from 'src/common/constants/roles.enum';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  organizationId: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret', 'default-secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { sub: userId } = payload;

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        status: UserStatus.ACTIVE,
      },
      relations: ['organization'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    if (!user.organization?.isActive) {
      throw new UnauthorizedException('Organization is not active');
    }

    return user;
  }
}
