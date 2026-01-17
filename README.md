# Strapi Backend

A Strapi v5 headless CMS backend with PostgreSQL database.

## 🚀 Tech Stack

- **Strapi v5** - Headless CMS
- **PostgreSQL 16** - Database
- **TypeScript** - Type safety

## 📋 Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Docker and Docker Compose (for PostgreSQL)

## 🛠️ Setup Instructions

### 1. Start PostgreSQL Database

```bash
docker-compose up -d
```

This will start a PostgreSQL container on port 5432.

### 2. Configure Environment Variables

Generate the `.env` file with secure keys:
```bash
node generate-env.js
```

This will create `.env` with all necessary environment variables and secure keys.

Alternatively, you can manually create `.env` with these variables:
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SSL=false

HOST=0.0.0.0
PORT=1337
APP_KEYS=your-generated-keys-here
API_TOKEN_SALT=your-generated-salt-here
ADMIN_JWT_SECRET=your-generated-secret-here
TRANSFER_TOKEN_SALT=your-generated-salt-here
JWT_SECRET=your-generated-secret-here

CORS_ORIGIN=http://localhost:3000
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Strapi

```bash
npm run develop
```

### 5. Create Admin User

On first run, you'll be prompted to create an admin user. Complete the registration.

### 6. Configure API Permissions

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. Enable `find` and `findOne` permissions for **Article**
3. Click **Save**

## 🌐 Access Points

- **Strapi Admin Panel**: http://localhost:1337/admin
- **Strapi API**: http://localhost:1337/api/articles

## 📝 Content Types

### Article

A basic article content type with:
- `title` (string, required)
- `content` (richtext)
- `slug` (uid, auto-generated from title)
- `publishedAt` (datetime)

## 🔧 Available Scripts

- `npm run develop` - Start Strapi in development mode
- `npm run build` - Build Strapi for production
- `npm run start` - Start Strapi in production mode
- `npm run strapi` - Display all available commands
- `npm run db:backup` - Create a database backup
- `npm run db:restore <file>` - Restore from a backup
- `npm run db:list` - List all available backups

## 💾 Data Persistence & Backups

### ✅ Your Data is Safe!

With PostgreSQL, **ALL** Strapi data persists in the database:
- ✅ Admin users and credentials
- ✅ Content types and schemas
- ✅ All content (articles, pages, etc.)
- ✅ Roles, permissions, and settings
- ✅ API tokens and configurations

**Data persists even when you:**
- Reinstall dependencies
- Update Strapi version
- Rebuild the application
- Stop/restart containers

### 🔄 Database Backups

**Create a backup:**
```bash
npm run db:backup
# Or with custom name
./scripts/backup-db.sh my-backup-name
```

**List backups:**
```bash
npm run db:list
```

**Restore from backup:**
```bash
npm run db:restore backups/strapi_backup_20240116_120000.sql.gz
```

**Backup media files:**
```bash
tar -czf backups/uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz public/uploads/
```

📖 **For detailed information, see [DATA_PERSISTENCE.md](./DATA_PERSISTENCE.md)**

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `docker-compose ps`
- Check database credentials in `.env`
- Verify PostgreSQL is accessible on port 5432

### CORS Issues
- Ensure `CORS_ORIGIN` in `.env` includes your frontend URL
- Check `config/middlewares.ts` for CORS configuration

## 📚 Next Steps

- Add more content types
- Configure media library
- Set up authentication
- Add custom plugins
- Configure production settings

## 📄 License

MIT
