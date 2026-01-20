# Docker Dependency Fix

## Issue
Missing `@emotion/styled` and `@emotion/react` dependencies required by Material-UI.

## Solution Applied
Added the missing dependencies to `react-web/package.json`:
- `@emotion/react`: ^11.11.1
- `@emotion/styled`: ^11.11.0

## If Running in Docker

After updating `package.json`, you need to reinstall dependencies in the container:

```bash
# Option 1: Rebuild the web container
docker-compose build web
docker-compose up -d web

# Option 2: Install inside the running container
docker-compose exec web npm install
docker-compose restart web
```

## If Running Locally

Dependencies are already installed. Just restart the dev server if it's running.

## Verify

The error should be resolved. The React app should compile successfully now.
