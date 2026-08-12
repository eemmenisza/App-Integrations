#!/usr/bin/env node
/**
 * Daily pull: Monday Parties CRM + People Pool → local snapshots + safe manifest.
 * Env:
 *   MONDAY_API_TOKEN (required)
 *   MONDAY_PARTIES_BOARD_ID (required)
 *   MONDAY_PEOPLE_POOL_BOARD_ID (required)
 *   QAAS_PARTIES_EXPORT_URL (optional) — if set, fetch JSON/CSV for reconcile stub
 *   CRM_DATA_DIR (optional) — default: data/crm
 */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const API = "https://api.monday.com/v2";
const token = process.env.MONDAY_API_TOKEN;
const partiesBoardId = process.env.MONDAY_PARTIES_BOARD_ID;
const peopleBoardId = process.env.MONDAY_PEOPLE_POOL_BOARD_ID;
const qaasExportUrl = process.env.QAAS_PARTIES_EXPORT_URL || "";
const dataRoot = path.resolve(process.env.CRM_DATA_DIR || path.join(process.cwd(), "data", "crm"));

function fail(msg) {
  console.error(`[sync-qaas-monday] ${msg}`);
  process.exit(1);
}

if (!token) fail("MONDAY_API_TOKEN is required");
if (!partiesBoardId) fail("MONDAY_PARTIES_BOARD_ID is required");
if (!peopleBoardId) fail("MONDAY_PEOPLE_POOL_BOARD_ID is required");

async function mondayQuery(query, variables = {}) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
      "API-Version": "2024-10",
    },
    body: JSON.stringify({ query, variables }),
  });
  const body = await res.json();
  if (!res.ok || body.errors) {
    fail(`Monday API error: ${JSON.stringify(body.errors || body)}`);
  }
  return body.data;
}

async function pullBoard(boardId) {
  // Paginate items (100/page)
  const items = [];
  let cursor = null;
  const boardMeta = { id: String(boardId), name: null };
  for (;;) {
    const data = await mondayQuery(
      `query ($ids: [ID!], $cursor: String) {
        boards(ids: $ids) {
          id
          name
          items_page(limit: 100, cursor: $cursor) {
            cursor
            items {
              id
              name
              updated_at
              column_values { id text value type }
            }
          }
        }
      }`,
      { ids: [String(boardId)], cursor }
    );
    const board = data.boards && data.boards[0];
    if (!board) fail(`Board not found: ${boardId}`);
    boardMeta.name = board.name;
    const page = board.items_page;
    for (const item of page.items || []) items.push(item);
    cursor = page.cursor;
    if (!cursor) break;
  }
  return { board: boardMeta, pulled_at: new Date().toISOString(), count: items.length, items };
}

function sha256File(filePath) {
  const h = crypto.createHash("sha256");
  h.update(fs.readFileSync(filePath));
  return h.digest("hex");
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

async function optionalQaasExport() {
  if (!qaasExportUrl) return null;
  const res = await fetch(qaasExportUrl);
  if (!res.ok) fail(`QAAS_PARTIES_EXPORT_URL fetch failed: ${res.status}`);
  const text = await res.text();
  return {
    pulled_at: new Date().toISOString(),
    bytes: Buffer.byteLength(text),
    // Do not parse PII into manifest; store raw beside snapshots only
    raw: text,
  };
}

async function main() {
  const day = new Date().toISOString().slice(0, 10);
  const snapDir = path.join(dataRoot, "snapshots", day);
  ensureDir(snapDir);

  console.log(`[sync-qaas-monday] Pulling Parties board ${partiesBoardId}`);
  const parties = await pullBoard(partiesBoardId);
  console.log(`[sync-qaas-monday] Pulling People Pool board ${peopleBoardId}`);
  const people = await pullBoard(peopleBoardId);

  const partiesPath = path.join(snapDir, "parties.json");
  const peoplePath = path.join(snapDir, "people-pool.json");
  fs.writeFileSync(partiesPath, JSON.stringify(parties, null, 2));
  fs.writeFileSync(peoplePath, JSON.stringify(people, null, 2));

  let qaasMeta = null;
  if (qaasExportUrl) {
    console.log("[sync-qaas-monday] Fetching QaaS Parties export");
    const qaas = await optionalQaasExport();
    const qaasPath = path.join(snapDir, "qaas-parties-export.raw");
    fs.writeFileSync(qaasPath, qaas.raw);
    qaasMeta = {
      pulled_at: qaas.pulled_at,
      bytes: qaas.bytes,
      sha256: sha256File(qaasPath),
    };
  }

  const manifest = {
    version: 1,
    integration: "qaas-parties-crm-people-pool-monday",
    pulled_at: new Date().toISOString(),
    day,
    boards: {
      parties: {
        id: parties.board.id,
        name: parties.board.name,
        count: parties.count,
        snapshot: `snapshots/${day}/parties.json`,
        sha256: sha256File(partiesPath),
      },
      people_pool: {
        id: people.board.id,
        name: people.board.name,
        count: people.count,
        snapshot: `snapshots/${day}/people-pool.json`,
        sha256: sha256File(peoplePath),
      },
    },
    qaas_export: qaasMeta,
    notes:
      "Snapshots contain PII and are gitignored; only this manifest should be committed.",
  };

  ensureDir(dataRoot);
  const manifestPath = path.join(dataRoot, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `[sync-qaas-monday] OK parties=${parties.count} people_pool=${people.count} manifest=${manifestPath}`
  );
}

main().catch((err) => fail(err && err.stack ? err.stack : String(err)));
