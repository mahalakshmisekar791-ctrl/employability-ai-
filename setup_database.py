#!/usr/bin/env python
"""
Database setup and migration script.
This script helps set up PostgreSQL database and migrate data from SQLite if needed.
"""

import os
import sys
from dotenv import load_dotenv
import psycopg2
from psycopg2 import sql

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from models.database import engine, Base
from models.database import Student, ScoreCard, AssessmentLog, Employer, OutreachLog, Survey, SurveyResponse, Meeting

load_dotenv()

def create_postgresql_database():
    """Create PostgreSQL database if it doesn't exist."""
    db_url = os.getenv("DATABASE_URL", "")
    
    if not db_url.startswith("postgresql"):
        print("❌ DATABASE_URL is not PostgreSQL. Please update .env file.")
        return False
    
    try:
        # Parse connection details
        # Format: postgresql://username:password@host:port/database
        parts = db_url.replace("postgresql://", "").split("/")
        db_name = parts[-1]
        
        user_pass_host = parts[0].split("@")
        user_pass = user_pass_host[0].split(":")
        username = user_pass[0]
        password = user_pass[1] if len(user_pass) > 1 else ""
        
        host_port = user_pass_host[1].split(":")
        host = host_port[0]
        port = host_port[1] if len(host_port) > 1 else "5432"
        
        # Connect to default postgres database
        print(f"📦 Connecting to PostgreSQL server at {host}:{port}...")
        conn = psycopg2.connect(
            host=host,
            port=port,
            user=username,
            password=password,
            database="postgres"
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Create database if not exists
        print(f"📊 Creating database '{db_name}' if it doesn't exist...")
        cursor.execute(sql.SQL("CREATE DATABASE IF NOT EXISTS {}").format(
            sql.Identifier(db_name)
        ))
        
        cursor.close()
        conn.close()
        print(f"✅ Database '{db_name}' created successfully!")
        return True
        
    except psycopg2.OperationalError as e:
        print(f"❌ PostgreSQL Connection Error: {e}")
        print("   Make sure PostgreSQL is installed and running.")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def create_tables():
    """Create all tables using SQLAlchemy models."""
    try:
        print("📋 Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created successfully!")
        return True
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False

def reset_database():
    """Drop all tables and recreate them."""
    try:
        print("⚠️  Dropping all existing tables...")
        Base.metadata.drop_all(bind=engine)
        print("✅ All tables dropped.")
        
        print("📋 Creating new tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created successfully!")
        return True
    except Exception as e:
        print(f"❌ Error resetting database: {e}")
        return False

def main():
    print("=" * 60)
    print("🗄️  Employability AI - Database Setup Tool")
    print("=" * 60)
    
    db_type = os.getenv("DATABASE_TYPE", "").lower()
    db_url = os.getenv("DATABASE_URL", "")
    
    print(f"\n📝 Current Configuration:")
    print(f"   Database Type: {db_type}")
    print(f"   Database URL: {db_url[:50]}..." if len(db_url) > 50 else f"   Database URL: {db_url}")
    
    if "postgresql" in db_url:
        print("\n🔧 Setting up PostgreSQL Database...")
        
        if not create_postgresql_database():
            print("\n❌ PostgreSQL database creation failed!")
            return False
        
        if not create_tables():
            print("\n❌ Table creation failed!")
            return False
        
        print("\n" + "=" * 60)
        print("✅ PostgreSQL Database Setup Complete!")
        print("=" * 60)
        
    elif "sqlite" in db_url:
        print("\n🔧 Setting up SQLite Database...")
        
        if not create_tables():
            print("\n❌ Table creation failed!")
            return False
        
        print("\n" + "=" * 60)
        print("✅ SQLite Database Setup Complete!")
        print("=" * 60)
    else:
        print(f"\n❌ Unknown database type: {db_type}")
        return False
    
    print("\n📌 Next steps:")
    print("   1. Run your server: python -m uvicorn backend.api.main:app --reload")
    print("   2. Test the API at: http://localhost:8001")
    print("   3. Access frontend at: http://localhost:3000")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
