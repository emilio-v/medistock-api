import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SubscriptionStatus,
  UserRole,
  UserStatus,
} from 'src/common/constants/roles.enum';
import { Organization } from 'src/database/entities/organization.entity';
import { User } from 'src/database/entities/user.entity';
import {
  AuthResponseDto,
  LoginDto,
  OrganizationResponseDto,
  RefreshTokenDto,
  RegisterDto,
  UserResponseDto,
} from 'src/modules/auth/dto';
import { JwtPayload } from 'src/modules/auth/strategies/jwt.strategy';
import { PasswordUtil } from 'src/modules/auth/utils/password.util';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private dataSource: DataSource,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      organizationName,
      organizationSlug,
    } = registerDto;

    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Check if organization slug already exists
    const existingOrg = await this.organizationRepository.findOne({
      where: { slug: organizationSlug },
    });

    if (existingOrg) {
      throw new ConflictException('Organization slug already exists');
    }

    // Validate password strength
    if (!PasswordUtil.validatePasswordStrength(password)) {
      throw new BadRequestException(
        'Password does not meet security requirements',
      );
    }

    // Use transaction for atomic operation
    return this.dataSource.transaction(async (manager) => {
      // Create organization first
      const organization = manager.create(Organization, {
        name: organizationName,
        slug: organizationSlug,
        subscriptionStatus: SubscriptionStatus.TRIAL,
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
      });

      const savedOrganization = await manager.save(organization);

      // Create user as organization owner
      const hashedPassword = await PasswordUtil.hash(password);

      const user = manager.create(User, {
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        phone,
        role: UserRole.OWNER,
        status: UserStatus.ACTIVE,
        organizationId: savedOrganization.id,
        emailVerifiedAt: new Date(), // Auto-verify for first user
      });

      const savedUser = await manager.save(user);
      savedUser.organization = savedOrganization;

      // Generate tokens
      const tokens = await this.generateTokens(savedUser);

      return this.buildAuthResponse(savedUser, tokens);
    });
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user with organization
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['organization'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await PasswordUtil.verify(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check user status
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    // Check organization status
    if (!user.organization?.isActive) {
      throw new UnauthorizedException('Organization is not active');
    }

    // Update last login
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return this.buildAuthResponse(user, tokens);
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verify refresh token
      const refreshSecret = this.configService.get<string>(
        'jwt.refreshSecret',
        'default-refresh-secret',
      );
      const payload = this.jwtService.verify<{ sub: string }>(refreshToken, {
        secret: refreshSecret,
      });

      // Get user
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ['organization'],
      });

      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (!user.organization?.isActive) {
        throw new UnauthorizedException('Organization is not active');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      return this.buildAuthResponse(user, tokens);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId, status: UserStatus.ACTIVE },
      relations: ['organization'],
    });
  }

  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role,
    };

    const expiresIn = this.configService.get<string>('jwt.expiresIn', '1h');
    const refreshExpiresIn = this.configService.get<string>(
      'jwt.refreshExpiresIn',
      '7d',
    );
    const refreshSecret = this.configService.get<string>(
      'jwt.refreshSecret',
      'default-refresh-secret',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn }),
      this.jwtService.signAsync(
        { sub: user.id },
        {
          secret: refreshSecret,
          expiresIn: refreshExpiresIn,
        },
      ),
    ]);

    // Convert expiresIn to seconds
    const expiresInSeconds = this.parseExpiresIn(expiresIn);

    return {
      accessToken,
      refreshToken,
      expiresIn: expiresInSeconds,
    };
  }

  private parseExpiresIn(expiresIn: string): number {
    // Simple parser for common formats like '1h', '7d', '3600s'
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 3600; // Default 1 hour

    const [, value, unit] = match;
    const num = parseInt(value, 10);

    switch (unit) {
      case 's':
        return num;
      case 'm':
        return num * 60;
      case 'h':
        return num * 3600;
      case 'd':
        return num * 86400;
      default:
        return 3600;
    }
  }

  private buildAuthResponse(
    user: User,
    tokens: { accessToken: string; refreshToken: string; expiresIn: number },
  ): AuthResponseDto {
    const userResponse: UserResponseDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      phone: user.phone,
      lastLoginAt: user.lastLoginAt,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      organizationId: user.organizationId,
    };

    const organizationResponse: OrganizationResponseDto = {
      id: user.organization.id,
      name: user.organization.name,
      slug: user.organization.slug,
      description: user.organization.description,
      email: user.organization.email,
      phone: user.organization.phone,
      subscriptionStatus: user.organization.subscriptionStatus,
      trialEndsAt: user.organization.trialEndsAt,
      subscriptionEndsAt: user.organization.subscriptionEndsAt,
      isActive: user.organization.isActive,
      createdAt: user.organization.createdAt,
    };

    return {
      user: userResponse,
      organization: organizationResponse,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    };
  }
}
