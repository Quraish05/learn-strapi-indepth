# PostgreSQL Database Commands

Quick reference for connecting to and managing the Strapi PostgreSQL database.

## 🔌 Connection Details

- **Container Name**: `strapi-postgres`
- **Database User**: `strapi`
- **Database Name**: `strapi`
- **Password**: `strapi` (as set in docker-compose.yml)
- **Port**: `5432`

## 📝 Common Commands

### Connect to PostgreSQL (Interactive)

```bash
docker exec -it strapi-postgres psql -U strapi -d strapi
```

Once connected, you can run SQL commands:
```sql
-- List all tables
\dt

-- List all tables with details
\dt+

-- List all databases
\l

-- Exit
\q
```

### Run SQL Commands (Non-Interactive)

```bash
# List all tables
docker exec strapi-postgres psql -U strapi -d strapi -c "\dt"

# Check admin users
docker exec strapi-postgres psql -U strapi -d strapi -c "SELECT username, email FROM admin_users;"

# Count articles
docker exec strapi-postgres psql -U strapi -d strapi -c "SELECT COUNT(*) FROM articles;"

# List all content types
docker exec strapi-postgres psql -U strapi -d strapi -c "SELECT * FROM strapi_core_store_settings WHERE key LIKE 'plugin_content_type_builder%';"
```

### Check Database Size

```bash
docker exec strapi-postgres psql -U strapi -d strapi -c "SELECT pg_size_pretty(pg_database_size('strapi'));"
```

### List All Users

```bash
docker exec strapi-postgres psql -U strapi -d strapi -c "SELECT username, email, created_at FROM admin_users;"
```

### View Recent Content

```bash
# Recent articles
docker exec strapi-postgres psql -U strapi -d strapi -c "SELECT id, title, created_at FROM articles ORDER BY created_at DESC LIMIT 10;"
```

### Backup Database (Manual)

```bash
docker exec strapi-postgres pg_dump -U strapi strapi > backup.sql

# Compressed
docker exec strapi-postgres pg_dump -U strapi strapi | gzip > backup.sql.gz
```

### Restore Database (Manual)

```bash
# From SQL file
docker exec -i strapi-postgres psql -U strapi -d strapi < backup.sql

# From compressed file
gunzip -c backup.sql.gz | docker exec -i strapi-postgres psql -U strapi -d strapi
```

## 🔍 Useful Queries

### Check Strapi Tables

```sql
-- List all Strapi-related tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### Check Admin Users

```sql
SELECT id, username, email, firstname, lastname, is_active, created_at 
FROM admin_users;
```

### Check Content Types

```sql
SELECT * FROM strapi_core_store_settings 
WHERE key LIKE 'plugin_content_type_builder%';
```

### Check Permissions

```sql
SELECT * FROM strapi_permission 
WHERE role_id = (SELECT id FROM strapi_role WHERE type = 'public');
```

## ⚠️ Important Notes

1. **Be careful with DELETE/UPDATE commands** - Always backup first!
2. **Don't modify core Strapi tables** unless you know what you're doing
3. **Use the backup scripts** (`npm run db:backup`) before making major changes
4. **Test queries** on a backup first if unsure

## 🆘 Troubleshooting

### Can't connect?
```bash
# Check if container is running
docker ps | grep strapi-postgres

# Check container logs
docker logs strapi-postgres

# Restart container
docker-compose restart postgres
```

### Wrong credentials?
Check your `docker-compose.yml` file for the correct:
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`

