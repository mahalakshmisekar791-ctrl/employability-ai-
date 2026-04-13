# PostgreSQL Setup Instructions for Windows

## Option 1: Using PostgreSQL Installer (Easiest)

### 1. Download PostgreSQL
- Visit: https://www.postgresql.org/download/windows/
- Download the latest version (14+)

### 2. Install PostgreSQL
- Run the installer
- **Username**: postgres (default)
- **Password**: Choose a secure password (remember this!)
- **Port**: 5432 (default)
- **Locale**: Select your language

### 3. Verify Installation
Open PowerShell and run:
```bash
psql --version
```

Should show: `psql (PostgreSQL) X.X.X`

---

## Option 2: Using pgAdmin (GUI Management)

### 1. Start pgAdmin
- PostgreSQL installer includes pgAdmin
- Search for "pgAdmin 4" in Start Menu
- Opens in browser at `http://localhost:5050`
- Login with your postgres password

### 2. Create Database via GUI
1. Right-click "Databases"
2. Select "Create" → "Database"
3. Name: `employability_ai`
4. Owner: `postgres`
5. Click "Save"

---

## Option 3: Using Command Line (Quickest)

### 1. Open PowerShell or Command Prompt
```bash
psql -U postgres
```
Enter your PostgreSQL password when prompted.

### 2. Create Database
```sql
CREATE DATABASE employability_ai;
```

### 3. Verify
```sql
\l
```
You should see `employability_ai` in the list.

### 4. Exit
```sql
\q
```

---

## Step-by-Step Setup for This Project

### 1. Update `.env` File
Edit `.env` in your project root:

```env
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/employability_ai

# Replace YOUR_PASSWORD with the password you set during PostgreSQL installation
```

**Example:**
```env
DATABASE_URL=postgresql://postgres:MySecurePass123@localhost:5432/employability_ai
```

### 2. Test Connection
Open PowerShell in the project directory:
```bash
cd "c:\Users\Mahalakshmi S\employability_ai"
venv\Scripts\activate
python
```

Then in Python:
```python
import psycopg2
conn = psycopg2.connect("postgresql://postgres:YOUR_PASSWORD@localhost:5432/employability_ai")
print("✅ Connected successfully!")
conn.close()
```

### 3. Run Database Setup Script
```bash
venv\Scripts\activate
python setup_database.py
```

Expected output:
```
🗄️  Employability AI - Database Setup Tool
========================================
📝 Current Configuration:
   Database Type: postgresql
   Database URL: postgresql://postgres:...
🔧 Setting up PostgreSQL Database...
📦 Creating database...
✅ Database 'employability_ai' created successfully!
📋 Creating database tables...
✅ All tables created successfully!
========================================
✅ PostgreSQL Database Setup Complete!
```

### 4. Start Your Server
```bash
python -m uvicorn backend.api.main:app --reload --host 0.0.0.0 --port 8001
```

### 5. Test It Works
Open browser: `http://localhost:8001/docs`
Should show API documentation (Swagger UI)

---

## Troubleshooting

### ❌ "psql is not recognized"
- PostgreSQL not in PATH
- Solution: Add `C:\Program Files\PostgreSQL\15\bin` to System Environment Variables

### ❌ "Connection refused"
- PostgreSQL not running
- Solution: Start PostgreSQL service in Services (services.msc) or:
  ```bash
  net start postgresql-x64-15
  ```

### ❌ "Password authentication failed"
- Wrong password in .env
- Solution: Reset PostgreSQL password or verify .env value

### ❌ "Database does not exist"
- Database not created yet
- Solution: Run `python setup_database.py`

---

## Optional: Install pgAdmin for GUI Management

```bash
# Install pgAdmin locally
pip install pgadmin4
```

Then access at: http://localhost:5050

---

## Backup Your Data

After setting up PostgreSQL, backup regularly:

```bash
# Backup database
pg_dump -U postgres employability_ai > backup.sql

# Restore database
psql -U postgres employability_ai < backup.sql
```

---

## Next: Deploy to Production

When ready for production:
- Use AWS RDS, Heroku PostgreSQL, or DigitalOcean Managed Databases
- Update DATABASE_URL to production URL
- Never commit `.env` to git (add to .gitignore)

---

For more help: https://www.postgresql.org/docs/
