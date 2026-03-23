#!/bin/bash
# Daily backup — place at /etc/cron.daily/ift-backup and chmod +x
set -e
DATE=$(date +%Y%m%d)
BACKUP_DIR=/var/www/ift/backups
mkdir -p "$BACKUP_DIR"

# 1. PostgreSQL dump
pg_dump -U ift_user ift_cms | gzip > "$BACKUP_DIR/db-$DATE.sql.gz"

# 2. Media files
tar -czf "$BACKUP_DIR/uploads-$DATE.tar.gz" /var/www/ift/uploads/

# 3. Retain last 30 days only
find "$BACKUP_DIR" -name "*.gz" -mtime +30 -delete

echo "Backup complete: $DATE"
