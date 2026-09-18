---
paths:
  - "**/export/**"
---

# The Outputs Are Generated

Never edit one, and never commit one. `source/export/` is git-ignored build output, so an edit survives until the next build and then disappears, taking the reason for it with it — change the input and rebuild instead.

| Path             | Written By   | Rebuild With    |
| ---------------- | ------------ | --------------- |
| `source/export/` | `next build` | `npm run build` |
