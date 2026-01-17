# Quick Reference: Data Persistence

## 🎯 Key Points

✅ **ALL Strapi data is stored in PostgreSQL** - Admin users, content, settings, everything!

✅ **Data persists automatically** - Docker volumes keep your data safe

✅ **You won't lose your admin user** - It's in the database, not in config files

## 📋 Common Scenarios

### "I reinstalled node_modules"
✅ **Safe** - Database is separate, your data is fine

### "I updated Strapi version"
✅ **Safe** - Migrations handle updates automatically

### "I changed config files"
✅ **Safe** - Config changes don't affect database content

### "I rebuilt Strapi"
✅ **Safe** - Only rebuilds admin panel, not database

### "I stopped Docker container"
✅ **Safe** - Volume persists, just restart: `docker-compose up -d`

## 💾 Backup Commands

```bash
# Create backup
npm run db:backup

# List backups
npm run db:list

# Restore backup
npm run db:restore backups/strapi_backup_YYYYMMDD_HHMMSS.sql.gz
```

## ⚠️ What to Avoid

❌ Don't delete Docker volume: `docker volume rm strapi-backend_postgres_data`
❌ Don't drop the database without a backup
❌ Don't format the volume directory

## 🔍 Verify Your Data

```bash
# Check if database has data
docker exec strapi-postgres psql -U strapi -d strapi -c "\dt"

# Check admin users
docker exec strapi-postgres psql -U strapi -d strapi -c "SELECT username, email FROM admin_users;"
```

## 📚 Full Documentation

See [DATA_PERSISTENCE.md](./DATA_PERSISTENCE.md) for complete details.

