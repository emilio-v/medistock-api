import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character',
  })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  // Organization data for first user (owner)
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  organizationName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'Organization slug must contain only lowercase letters, numbers, and hyphens',
  })
  organizationSlug: string;
}
