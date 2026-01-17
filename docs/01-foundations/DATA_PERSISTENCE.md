# Data Persistence Guide

This guide explains how Strapi data is persisted and how to backup/restore your data.

## 📊 What Gets Stored in PostgreSQL

When using PostgreSQL, **ALL** Strapi data is stored in the database, including:

### ✅ Configuration Data (Persists)
- **Admin Users** - All admin accounts and credentials
- **Roles & Permissions** - User roles, permissions, and access control settings
- **API Tokens** - Generated API tokens and their configurations
- **Webhooks** - Webhook configurations
- **Settings** - All Strapi settings and configurations

### ✅ Content Types (Persists)
- **Content Type Schemas** - All your content type definitions
- **Relations** - Relationships between content types
- **Field configurations** - All field types and settings

### ✅ Content Data (Persists)
- **All Content Entries** - Articles, pages, and any content you create
- **Media Files Metadata** - File information (actual files stored in `public/uploads/`)
- **Draft vs Published** - Content state (draft/published)

### ✅ System Data (Persists)
- **Migrations** - Database migration history
- **Strapi Core Tables** - All internal Strapi tables

## 🔒 Why Data Persists

With PostgreSQL and Docker volumes:
1. **Database Volume** - PostgreSQL data is stored in a Docker volume (`postgres_data`)
2. **Volume Persistence** - The volume persists even if you:
   - Stop/restart the container
   - Rebuild Strapi
   - Update dependencies
   - Change Strapi configuration files

## 💾 Backup Strategy

### Automatic Backups

Create regular backups to protect against:
- Accidental data deletion
- Database corruption
- System failures
- Migration issues

### Manual Backup

```bash
# Create a backup
npm run db:backup

# Or with a custom name
./scripts/backup-db.sh my-backup-name
```

Backups are stored in `./backups/` directory and are automatically compressed.

### List Backups

```bash
npm run db:list
```

### Restore from Backup

```bash
# Restore a backup
npm run db:restore backups/strapi_backup_20240116_120000.sql.gz

# Or directly
./scripts/restore-db.sh backups/strapi_backup_20240116_120000.sql.gz
```

## 🔄 What Happens When You...

### Reinstall Dependencies
✅ **Data is SAFE** - Database is separate from node_modules

### Update Strapi Version
✅ **Data is SAFE** - Migrations handle schema updates automatically

### Change Configuration Files
✅ **Data is SAFE** - Config changes don't affect database content

### Rebuild Strapi
✅ **Data is SAFE** - Only rebuilds the admin panel, not the database

### Delete `node_modules` or `dist`
✅ **Data is SAFE** - Database is completely separate

### Stop/Start Docker Container
✅ **Data is SAFE** - Volume persists between container restarts

### Remove Docker Container (but keep volume)
✅ **Data is SAFE** - Volume persists, just recreate container

## ⚠️ What CAN Cause Data Loss

### Removing Docker Volume
```bash
# ❌ DON'T DO THIS (unless you have a backup)
docker volume rm strapi-backend_postgres_data
```

### Dropping Database
```bash
# ❌ DON'T DO THIS (unless you have a backup)
docker exec strapi-postgres psql -U strapi -c "DROP DATABASE strapi;"
```

### Formatting Docker Volume Directory
If you're using a local directory mount, formatting that directory will lose data.

## 🛡️ Best Practices

### 1. Regular Backups
```bash
# Add to cron for daily backups
0 2 * * * cd /path/to/strapi-backend && npm run db:backup
```

### 2. Backup Before Major Changes
Always backup before:
- Upgrading Strapi version
- Running migrations manually
- Making major schema changes
- Testing in production

### 3. Store Backups Off-Site
- Copy backups to cloud storage (S3, Google Drive, etc.)
- Keep multiple backup versions
- Test restore process periodically

### 4. Version Control
While database content shouldn't be in git, you should version control:
- Content type schemas (in `src/api/`)
- Configuration files
- Custom code and plugins

## 📁 File Storage

**Important**: Media files (images, videos, etc.) are stored in `public/uploads/` directory, NOT in the database.

To backup media files:
```bash
# Backup uploads directory
tar -czf backups/uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz public/uploads/
```

## 🔍 Verify Data Persistence

### Check Database Connection
```bash
docker exec strapi-postgres psql -U strapi -d strapi -c "\dt"
```

### Check Admin Users
```bash
docker exec strapi-postgres psql -U strapi -d strapi -c "SELECT username, email FROM admin_users;"
```

### Check Content
```bash
docker exec strapi-postgres psql -U strapi -d strapi -c "SELECT COUNT(*) FROM articles;"
```

## 🚀 Quick Recovery

If you lose your admin user or need to reset:

1. **Restore from Backup** (if available):
   ```bash
   npm run db:restore backups/latest-backup.sql.gz
   ```

2. **Or Create New Admin** (if database is intact):
   ```bash
   npm run develop
   # Strapi will detect existing data and let you create a new admin
   ```

3. **Or Reset Admin Password** (if you have database access):
   ```bash
   # This requires direct database access - use with caution
   docker exec strapi-postgres psql -U strapi -d strapi
   ```

## 📝 Summary

✅ **With PostgreSQL, your data is safe and persistent**
✅ **Use regular backups for extra protection**
✅ **Docker volumes ensure data survives container restarts**
✅ **Backup both database AND media files**

The key is: **PostgreSQL stores everything, and Docker volumes keep it safe!**

