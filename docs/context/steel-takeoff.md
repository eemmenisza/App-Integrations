# Steel takeoff — QaaS Structural Steel Engine

Source: `prompts/cursor-qaas-steel-engine.md` in `eemmenisza/build-quantify`. No SSM clause numbers in this file.
Agent rules: `AUGMENT.md`.

## Prime directive

The LLM does not calculate mass. Vision and language models emit structured
facts (mark, designation, length, count, bbox). A Postgres function computes
kilograms. Any Edge Function that returns a mass value produced by a model
is a defect (gate G8).

## Gates G1–G13

| Gate | Meaning | Enforcement |
|------|---------|-------------|
| G1 | Section designation unresolved (no catalogue match) | `steel-validate` / `steel-section-resolve` |
| G2 | Missing or non-positive `length_mm` | `steel-validate` |
| G3 | Missing or non-positive `count` | `steel-validate` |
| G4 | Missing mark | `steel-validate` |
| G5 | `length_source = scaled` must cap confidence at 0.5 | `steel-vision-extract` + `steel-validate` |
| G6 | `unreadable_regions` omitted on a vision payload | `steel-validate` (treat as over-confident) |
| G7 | Active catalogue has fewer than 100 rows | warning: `Section catalogue incomplete — takeoff results are not reliable.` |
| G8 | Model output contains a mass field (`mass_kg`, `qty_tonnes`, `total_mass`, …) | reject; mass is SQL-only |
| G9 | ACTIVE member with no `section_catalogue_id` after resolve | `steel-validate` |
| G10 | Nguni/Sotho meeting language without `needs_human_review` | `meeting-fact-extract` |
| G11 | Duplicate ACTIVE `(project_id, mark, grid_ref, level_ref)` | unique partial index |
| G12 | `connection_allowance_pct` outside 0–20 | CHECK constraint |
| G13 | `provenance` or `confidence` null on `steel_members` | NOT NULL |

## Catalogue

`steel_section_catalogue` is versioned and human-seeded from the SAISC
handbook. Models never write this table. A header plus three placeholder
test rows ships in `build-quantify`; the full handbook is seeded by hand.

## Mass

Rounding is applied **once**, at the end of `steel_project_mass_t`.
Density for plates is 7850 kg/m³.

## Identity

`mark + grid + level` is the identity of a member. Do not disable the
unique partial index to make a seed script pass.
