# Docker Quick Start Guide

## Prerequisites
- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Start Everything

```bash
docker-compose up -d
```

## Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000/api
- **Database**: localhost:3306

## Stop Everything

```bash
docker-compose down
```

## View Logs

```bash
docker-compose logs -f
```

## Services

1. **db** - MySQL Database (port 3306)
2. **api** - Node.js API (port 5000)
3. **web** - React Frontend (port 3000)

## Troubleshooting

### Port conflicts
Change ports in `docker-compose.yml` if needed.

### Database connection
Wait for database health check to pass (about 30 seconds).

### Rebuild after changes
```bash
docker-compose build
docker-compose up -d
```

For detailed information, see `DOCKER_SETUP.md`.
