import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiVersion } from 'src/common/constants/api-versions';
import { User } from 'src/database/entities/user.entity';
import { AuthService } from 'src/modules/auth/auth.service';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import {
  AuthResponseDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  UserResponseDto,
} from 'src/modules/auth/dto';
import { TenantGuard } from 'src/modules/auth/guards/tenant.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Version(ApiVersion.V1)
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Version(ApiVersion.V1)
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @Version(ApiVersion.V1)
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Get('me')
  @Version(ApiVersion.V1)
  @UseGuards(AuthGuard('jwt'), TenantGuard)
  getProfile(@CurrentUser() user: User): UserResponseDto {
    return {
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
  }

  @Post('logout')
  @Version(ApiVersion.V1)
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(): void {
    // In a real application, you might want to:
    // 1. Add refresh token to a blacklist
    // 2. Clear any server-side sessions
    // For JWT-only auth, client handles token removal
    return;
  }
}
