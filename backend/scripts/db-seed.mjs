import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import dotenv from "dotenv"
import pg from "pg"

dotenv.config({ path: ".env.local" })
dotenv.config()

const { Client } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TABLE_CONFIG = [
  { name: "suppliers", conflictKey: "id", jsonbCols: [] },
  { name: "products", conflictKey: "id", jsonbCols: ["suppliers"] },
  {
    name: "conversations",
    conflictKey: "id",
    jsonbCols: ["ai_extraction", "next_action"],
  },
  {
    name: "negotiation_messages",
    conflictKey: "id",
    jsonbCols: ["order_summary"],
  },
  { name: "invoices", conflictKey: "id", jsonbCols: ["flags", "history"] },
  { name: "restock_recommendations", conflictKey: "id", jsonbCols: [] },
  { name: "threshold_change_requests", conflictKey: "id", jsonbCols: [] },
  { name: "app_config", conflictKey: "key", jsonbCols: ["value"] },
]

function applyLegacyAliases(tableName, row) {
  const normalized = { ...row }

  if (
    tableName === "products" &&
    normalized.current_stock == null &&
    normalized.stock_on_hand != null
  ) {
    normalized.current_stock = normalized.stock_on_hand
  }

  return normalized
}

function uniqueColumns(rows) {
  const keys = new Set()
  rows.forEach((row) => {
    Object.keys(row).forEach((key) => keys.add(key))
  })
  return Array.from(keys)
}

function buildInsertSQL(table, columns, rows, conflictKey, jsonbCols) {
  const values = []
  const rowPlaceholders = rows.map((row, rowIndex) => {
    const placeholders = columns.map((column, colIndex) => {
      const paramIndex = rowIndex * columns.length + colIndex + 1
      const isJsonb = jsonbCols.includes(column)
      const value = row[column] ?? null
      values.push(isJsonb && value !== null ? JSON.stringify(value) : value)
      return isJsonb ? `CAST($${paramIndex} AS jsonb)` : `$${paramIndex}`
    })
    return `(${placeholders.join(", ")})`
  })

  const updateCols = columns
    .filter((column) => column !== conflictKey)
    .map((column) => `${column} = EXCLUDED.${column}`)

  const sql = `
    INSERT INTO public.${table} (${columns.join(", ")})
    VALUES ${rowPlaceholders.join(",\n")}
    ON CONFLICT (${conflictKey}) DO UPDATE
    SET ${updateCols.join(", ")};
  `

  return { sql, values }
}

async function main() {
  const databaseUrl = process.env.SUPABASE_DB_URL

  if (!databaseUrl) {
    throw new Error(
      "Missing SUPABASE_DB_URL. Set it in backend/.env.local or backend/.env before running db:seed."
    )
  }

  const seedPath = path.resolve(__dirname, "../supabase/seed-data.json")
  const rawSeed = await readFile(seedPath, "utf8")
  const seed = JSON.parse(rawSeed)

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  })

  await client.connect()

  try {
    await client.query("BEGIN")

    for (const config of TABLE_CONFIG) {
      const rows = seed[config.name] ?? []
      if (!Array.isArray(rows) || rows.length === 0) {
        continue
      }

      const normalizedRows = rows.map((row) =>
        applyLegacyAliases(config.name, row)
      )

      const columns = uniqueColumns(normalizedRows)
      const { sql, values } = buildInsertSQL(
        config.name,
        columns,
        normalizedRows,
        config.conflictKey,
        config.jsonbCols
      )

      await client.query(sql, values)
      console.log(`Seeded ${config.name}: ${normalizedRows.length} row(s)`)
    }

    await client.query("COMMIT")
    console.log("Seed completed successfully.")
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error("db:seed failed:", error.message)
  process.exit(1)
})
