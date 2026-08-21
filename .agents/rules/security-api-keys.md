# Security Rule: Zero API Key Exposure & Vercel Secrets Management

## Mandate
1. **Never Hardcode Secrets**: API keys, private tokens, service role credentials, and database passwords must NEVER be hardcoded in source code or pushed to Git repositories.
2. **Vercel Environment Storage**: All sensitive configuration must be stored and managed exclusively in **Vercel Environment Variables** (`Project Settings > Environment Variables` or via `vercel env add`).
3. **Environment Files Protection**:
   - `.env`, `.env.local`, `.env.*.local`, `*.key`, `*.pem`, `*credentials*` must remain listed in `.gitignore` and never staged or committed.
   - Only `.env.example` (with dummy placeholders) is permitted in the repository.
4. **Pre-Push Security Check**: Before every `git push` or release, all staged files must be scanned to verify that no secret keys or credentials are leaked.
5. **Client-Side Safe Exposure**:
   - Only public keys intended for client browsers (e.g. Supabase Public Anon Key) may be loaded at runtime via environment config endpoints or client runtime injectors.
   - Service role keys, database connection strings, and Odoo API administrative keys must remain strictly server-side.
