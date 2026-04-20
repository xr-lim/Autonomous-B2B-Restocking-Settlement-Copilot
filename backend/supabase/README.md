# Supabase Data Setup (Backend)

Backend owns schema initialization.

## 1) Environment

Create backend/.env.local from backend/.env.example and set:

- SUPABASE_DB_URL

## 2) Install dependencies

From backend folder run:

- npm install

## 3) Initialize schema

Run:

- npm run db:init

This command applies backend/supabase/schema.sql to your Supabase Postgres database.

## 4) Seed demo data from JSON

Seed file:

- backend/supabase/seed-data.json

Run:

- npm run db:seed

The seed script upserts rows by `id` (or `key` for app_config).

## 5) Notes

- The script runs schema SQL in a transaction.
- If it fails, changes are rolled back.
- The SQL uses IF NOT EXISTS for idempotent table/index creation.
