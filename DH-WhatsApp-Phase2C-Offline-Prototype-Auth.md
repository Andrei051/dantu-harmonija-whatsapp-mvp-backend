# Phase 2C — Offline AI prototype authorisation

**Date:** 2026-09-18  
**Status:** **AUTHORISED** 🟢 · harness ready  

## Run status

| Run | Status | Notes |
|---|---|---|
| v2-offline attempt 1 | **INVALID** | HTTP 429 TPM — ignore |
| v2-offline attempt 2 | **VALID / FROZEN** 🔒 | 60/70; Context 6→0; multi-turn 1/7→6/7; see summary |

## Scope (frozen)

| Layer | Artefact |
|---|---|
| Corpus | NL Corpus v0.1 |
| Schema | Interpretation Schema v1 |
| Policy | Signal → Policy Mapping v1 |
| Prompt | Interpreter Prompt **v0.1** |
| Context | current message + preceding turns from that corpus case |
| Scorer | same behavioural scorer as Evaluation v1.1 |

## Out of scope

WhatsApp · production webhook · vector DB · AI-written patient answers · price sync · v1.1 patches · structured conversation state · prompt tuning after failures · multi-model sweeps  

## How to run

```powershell
npx tsx scripts/phase2c/run_offline_v2.ts
```

Uses `.env` `OPENAI_API_KEY`. Optional: `OPENAI_MODEL=gpt-4o`.

Outputs:

- `data/DH-WhatsApp-NL-Evaluation-v2-offline-invocations.jsonl`
- `data/DH-WhatsApp-NL-Evaluation-v2-offline-results.json`
- `DH-WhatsApp-NL-Evaluation-v2-offline-summary.md`

Schema-invalid model output → recorded failure + safe unknown fallback (**not** silently repaired).  
API 429 → retry with backoff (engineering transport fix; not prompt tuning).
