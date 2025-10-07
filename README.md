# MediStock API 🏥

**Multi-tenant SaaS Backend for Pharmacy Management**

A modern, scalable NestJS API for small-to-medium pharmacy operations, featuring inventory management, POS system, multi-branch operations, and comprehensive business analytics.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 20+ (LTS recommended)
- **PostgreSQL**: 16+
- **npm**: Latest version

### Installation

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env.local

# Initialize Git hooks
npm run prepare

# Start development server
npm run start:dev
```

**API will be available at:** `http://localhost:3001/api/v1`

## 🏗️ Tech Stack

| Technology          | Purpose           | Version |
| ------------------- | ----------------- | ------- |
| **NestJS**          | Backend Framework | 11.x    |
| **TypeScript**      | Language          | 5.x     |
| **PostgreSQL**      | Database          | 16+     |
| **TypeORM**         | ORM               | 0.3.x   |
| **Passport JWT**    | Authentication    | Latest  |
| **class-validator** | Validation        | Latest  |

## 📁 Project Structure

```
src/
├── common/                 # Shared utilities
│   ├── constants/         # API versions, enums
│   ├── decorators/        # Custom decorators
│   ├── guards/           # Auth, tenant, roles guards
│   └── interceptors/     # Global interceptors
├── config/               # Configuration modules
│   ├── app.config.ts     # App settings
│   ├── database.config.ts # DB configuration
│   ├── jwt.config.ts     # JWT settings
│   └── typeorm.config.ts # TypeORM CLI config
├── database/
│   ├── entities/         # TypeORM entities
│   ├── migrations/       # Database migrations
│   └── seeds/           # Seed data
└── modules/             # Business modules
    ├── auth/
    ├── users/
    ├── products/
    └── ...
```

## 🛠️ Development

### Available Scripts

| Command              | Description                            |
| -------------------- | -------------------------------------- |
| `npm run start:dev`  | Start development server (watch mode)  |
| `npm run build`      | Build production bundle                |
| `npm run lint`       | Run ESLint + fix issues + sort imports |
| `npm run format`     | Format code with Prettier              |
| `npm run format:all` | Format all files + lint                |
| `npm run test`       | Run unit tests                         |
| `npm run test:e2e`   | Run E2E tests                          |
| `npm run commit`     | Interactive conventional commits       |

### Code Quality Tools

**✅ Automated on Save:**

- **ESLint** - Code linting + auto-fix
- **Prettier** - Code formatting
- **Import sorting** - Organized imports
- **TypeScript** - Type checking

**✅ Git Hooks (Husky):**

- **Pre-commit**: Lint + format staged files
- **Commit-msg**: Validate conventional commit format

### Commit Standards

We use **Conventional Commits** for consistent commit messages:

```bash
# Use interactive prompts (recommended)
npm run commit

# Or manual format
git commit -m "feat(products): add inventory tracking"
git commit -m "fix(auth): resolve JWT token expiry"
git commit -m "docs: update API documentation"
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 🗄️ Database

### Configuration

The API supports both connection string and individual parameters:

```bash
# Option 1: Connection String (Production)
DATABASE_URL="postgresql://user:pass@host:5432/medistock"

# Option 2: Individual Parameters (Development)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=medistock
POSTGRES_PASSWORD=medistock123
POSTGRES_DB=medistock
```

### Migrations

```bash
# Generate migration after entity changes
npm run migration:generate -- src/database/migrations/DescriptiveName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

### Architecture Features

**🏢 Multi-tenancy:**

- Shared database with `organizationId` filtering
- Header-based tenant resolution (`x-tenant-slug`)
- Row-level security with proper indexing

**🔒 Security:**

- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Soft delete on all entities
- Input validation with class-validator

**⚡ Performance:**

- Optimistic locking for inventory operations
- Pessimistic locking for critical operations
- Connection pooling and query optimization
- Proper database indexing

## 🌐 API Overview

### Base URL Structure

```
Production:  https://api.medistock.app/api/v1
Development: http://localhost:3001/api/v1
```

### Authentication

```bash
# All API requests require:
Authorization: Bearer <jwt_token>
x-tenant-slug: <organization-slug>
```

### Health Check

```bash
GET /api/v1/health
```

### API Versioning

The API uses URI-based versioning (`/api/v1`, `/api/v2`) for backward compatibility.

## 📊 Key Features

### 🏪 Multi-tenant Architecture

- **Organization isolation** - Complete data separation per tenant
- **Branch management** - Multiple pharmacy locations per organization
- **User roles** - Owner, Admin, Member permissions per organization

### 📦 Inventory Management

- **Real-time tracking** - Stock levels across multiple branches
- **Batch management** - Expiration dates and lot numbers
- **Low stock alerts** - Automated notifications
- **Transfer management** - Inter-branch stock transfers

### 💳 Point of Sale (POS)

- **Quick sales processing** - Barcode scanning support
- **Payment methods** - Cash, card, mixed payments
- **Receipt generation** - Thermal printer support
- **Daily cash register** - Opening/closing procedures

### 📈 Business Intelligence

- **Sales analytics** - Daily, weekly, monthly reports
- **Inventory reports** - Stock valuation, turnover analysis
- **Expense tracking** - Operating costs management
- **Profit/loss statements** - Financial performance

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e

# Watch mode for development
npm run test:watch
```

## 📝 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Application
NODE_ENV=development
PORT=3001
APP_NAME=MediStock

# Database
DATABASE_URL=postgresql://medistock:medistock123@localhost:5432/medistock

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

## 🚢 Deployment

### Production Build

```bash
npm run build
npm run start:prod
```

### Docker Support

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feat/amazing-feature`)
3. **Commit** using conventional commits (`npm run commit`)
4. **Push** to the branch (`git push origin feat/amazing-feature`)
5. **Open** a Pull Request

## 🆘 Troubleshooting

### Common Issues

**Database Connection:**

```bash
# Check PostgreSQL is running
pg_ctl status

# Verify connection string
npm run typeorm -- query "SELECT version()"
```

**Build Errors:**

```bash
# Clear build cache
rm -rf dist node_modules
npm install
npm run build
```

**Import Errors:**

```bash
# Run import sorting and formatting
npm run format:all
```

## 📞 Support

- **Issues**: Use GitHub Issues for bug reports
- **Development**: Use `npm run commit` for proper commit formatting

---

**Built with ❤️ using NestJS** | **Multi-tenant SaaS for Modern Pharmacies**
