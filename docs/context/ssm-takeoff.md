# SSM takeoff coding

Source: `prompts/cursor-qaas-steel-engine.md` in `eemmenisza/build-quantify`.
Agent rules: `AUGMENT.md`.

`steel-boq-compose` may attach an SSM code to an approved member line.
Claude is used for **coding only** — never for mass or quantity.

**No SSM clause number appears in code or copy without a source reference.**
Until a cited handbook extract is checked in, BoQ lines store `ssm_code`
as data with `provenance.source_ref` required. Do not hard-code clause
numbers in prompts or TypeScript.
