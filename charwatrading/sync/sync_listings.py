#!/usr/bin/env python3
"""
Charwa Trading - Data Sync Script
Syncs listings from Market Intelligence PostgreSQL to Supabase PostgreSQL.
Designed to run on cron (hourly or after each scraper run).

Usage:
    python sync_listings.py
    python sync_listings.py --full   # Force full resync

Environment variables (see config.env.example):
    SOURCE_DB_URL  - Market Intelligence PostgreSQL connection string
    TARGET_DB_URL  - Supabase PostgreSQL connection string
"""

import os
import sys
import argparse
import logging
from datetime import datetime, timedelta, timezone

import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), 'config.env'))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# Database connection strings
SOURCE_DB_URL = os.environ.get('SOURCE_DB_URL')
TARGET_DB_URL = os.environ.get('TARGET_DB_URL')

# Column mapping from market_intelligence to Supabase listings
COLUMN_MAP = {
    'source_site': 'source_site',
    'source_id': 'source_id',
    'url': 'url',
    'title': 'title',
    'price_cents': 'price_cents',
    'year': 'year',
    'mileage_km': 'mileage_km',
    'power_kw': 'power_kw',
    'brand': 'brand',
    'model': 'model',
    'axle_configuration': 'axle_configuration',
    'euro_standard': 'euro_standard',
    'transmission': 'transmission',
    'cab_type': 'cab_type',
    'location': 'location',
    'country_code': 'country_code',
    'company_name': 'company_name',
    'seller_phone': 'seller_phone',
    'image_url': 'image_url',
    'description': 'description',
    'priority': 'priority',
    'first_seen_at': 'first_seen_at',
    'last_seen_at': 'last_seen_at',
}

# Valid source_site values (must match marketplaces table)
VALID_SOURCES = {
    'autoline', 'truck1', 'truckscout24', 'mobile_de', 'mascus',
    'europa_truck', 'kleyntrucks', 'bas_trucks', 'tradus',
    'truck_nl', 'commercialmotor', 'otomoto', 'hasznaltauto'
}


def get_source_connection():
    """Connect to the Market Intelligence (source) database."""
    if not SOURCE_DB_URL:
        raise ValueError("SOURCE_DB_URL environment variable not set")
    return psycopg2.connect(SOURCE_DB_URL)


def get_target_connection():
    """Connect to the Supabase (target) database."""
    if not TARGET_DB_URL:
        raise ValueError("TARGET_DB_URL environment variable not set")
    return psycopg2.connect(TARGET_DB_URL)


def get_last_sync_time(target_conn):
    """Get the most recent synced_at timestamp from target."""
    with target_conn.cursor() as cur:
        cur.execute("SELECT MAX(synced_at) FROM listings")
        result = cur.fetchone()
        return result[0] if result and result[0] else None


def fetch_source_listings(source_conn, since=None):
    """Fetch listings from market_intelligence database."""
    source_columns = list(COLUMN_MAP.keys())
    select_clause = ', '.join(source_columns)

    query = f"SELECT {select_clause} FROM listings"
    params = []

    if since:
        query += " WHERE last_seen_at > %s"
        params.append(since)

    query += " ORDER BY last_seen_at ASC"

    with source_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute(query, params)
        rows = cur.fetchall()

    # Filter to valid source_sites only
    valid_rows = [r for r in rows if r.get('source_site') in VALID_SOURCES]
    logger.info(f"Fetched {len(valid_rows)} listings from source ({len(rows)} total, {len(rows) - len(valid_rows)} filtered)")
    return valid_rows


def upsert_listings(target_conn, listings):
    """Upsert listings into target Supabase database."""
    if not listings:
        logger.info("No listings to upsert")
        return 0

    target_columns = list(COLUMN_MAP.values())
    columns_str = ', '.join(target_columns)
    placeholders = ', '.join(['%s'] * len(target_columns))

    # Build ON CONFLICT UPDATE clause (update all columns except source_site, source_id)
    update_columns = [c for c in target_columns if c not in ('source_site', 'source_id')]
    update_clause = ', '.join([f"{c} = EXCLUDED.{c}" for c in update_columns])

    upsert_sql = f"""
        INSERT INTO listings ({columns_str}, synced_at)
        VALUES ({placeholders}, NOW())
        ON CONFLICT (source_site, source_id)
        DO UPDATE SET {update_clause}, synced_at = NOW()
    """

    count = 0
    batch_size = 500

    with target_conn.cursor() as cur:
        for i in range(0, len(listings), batch_size):
            batch = listings[i:i + batch_size]
            values_list = []
            for row in batch:
                values = [row.get(src_col) for src_col in COLUMN_MAP.keys()]
                values_list.append(values)

            psycopg2.extras.execute_batch(
                cur,
                upsert_sql,
                values_list,
                page_size=100
            )
            count += len(batch)
            logger.info(f"Upserted batch {i // batch_size + 1}: {len(batch)} listings")

    target_conn.commit()
    logger.info(f"Total upserted: {count} listings")
    return count


def update_marketplace_counts(target_conn):
    """Update listing_count in marketplaces table."""
    sql = """
        UPDATE marketplaces m
        SET listing_count = (
            SELECT COUNT(*) FROM listings l
            WHERE l.source_site = m.id
        ),
        updated_at = NOW()
    """
    with target_conn.cursor() as cur:
        cur.execute(sql)
    target_conn.commit()
    logger.info("Updated marketplace listing counts")


def main():
    parser = argparse.ArgumentParser(description='Sync Market Intelligence listings to Supabase')
    parser.add_argument('--full', action='store_true', help='Force full resync (ignore last sync time)')
    args = parser.parse_args()

    logger.info("=" * 60)
    logger.info("Charwa Trading - Listings Sync")
    logger.info("=" * 60)

    try:
        source_conn = get_source_connection()
        target_conn = get_target_connection()
        logger.info("Connected to both databases")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        sys.exit(1)

    try:
        # Determine sync window
        since = None
        if not args.full:
            since = get_last_sync_time(target_conn)
            if since:
                logger.info(f"Delta sync since: {since}")
            else:
                logger.info("No previous sync found, performing full sync")

        # Fetch from source
        listings = fetch_source_listings(source_conn, since)

        # Upsert to target
        count = upsert_listings(target_conn, listings)

        # Update marketplace listing counts
        update_marketplace_counts(target_conn)

        logger.info(f"Sync complete: {count} listings processed")

    except Exception as e:
        logger.error(f"Sync failed: {e}")
        sys.exit(1)
    finally:
        source_conn.close()
        target_conn.close()
        logger.info("Database connections closed")


if __name__ == '__main__':
    main()
