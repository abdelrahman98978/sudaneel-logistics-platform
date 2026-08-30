# Deployment & Environment Policy: Staging-First Enforcement

## Mandatory Rule
1. **Default Deployment Target**: All automated uploads, git pushes, and deployments MUST ALWAYS target the **Staging / Preview Environment** (`staging` branch / Vercel Preview Deployments).
2. **Production Promotion Restriction**: NEVER deploy, push directly to `production` (`--prod`), or promote a build to Production unless the USER explicitly requests:
   - "ارفع الى البرودكشن"
   - "انشر على Production"
   - "Promote to Production"
3. **Environment Separation**:
   - **Staging / Preview**: Used for iterative testing, QA verification, and feature reviews.
   - **Production**: Locked and protected; requires explicit direct command from the user before executing.
