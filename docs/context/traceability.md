# Traceability

Source: `prompts/cursor-qaas-steel-engine.md` in `eemmenisza/build-quantify`.
Agent rules: `AUGMENT.md`.

Every `steel_members` row must carry:

- `provenance` (not null) — how the row was obtained (`vision`, `schedule`,
  `manual`, `repair`)
- `confidence` (not null)
- `source_drawing_id` / `source_page` / `source_bbox` when from a drawing
- `length_source` on the vision payload: `dimension_string` | `grid_derived` | `scaled`

Steel rows extend the existing five-value provenance scheme. Site-record
facts are held as `AI-generated` until PrQS approval, then promoted to
`user-entered` with the recording, timestamp and speaker cited in the
audit trail. A sixth `SITE_RECORD` value is deferred.

`steel_boq_items.provenance` is jsonb and must cite the takeoff member ids
and the catalogue version used for mass.

`meeting_facts` insert as `PENDING_PRQS` only. They never write
`steel_members`. A PRQS review is the only path that may later change status.

`steel_corrections` records `mass_delta_kg` from SQL re-calculation, not
from a model.
