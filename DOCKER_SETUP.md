# Docker Setup Guide

This guide explains how to run the entire Support Together application using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- At least 4GB RAM available for Docker

## Quick Start

### 1. Start All Services

```bash
docker-compose up -d
```

This will start:
- MySQL database (port 3306)
- Node.js API (port 5000)
- React frontend (port 3000)

### 2. View Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f db
```

### 3. Stop All Services

```bash
docker-compose down
```

### 4. Stop and Remove Volumes (Clean Slate)

```bash
docker-compose down -v
```

## Services

### Database (MySQL)
- **Container**: `support-together-db`
- **Port**: 3306
- **Database**: `support`
- **Username**: `support`
- **Password**: `support`
- **Root Password**: `toor`

### API (Node.js)
- **Container**: `support-together-api`
- **Port**: 5000
- **URL**: http://localhost:5000
- **API URL**: http://localhost:5000/api

### Frontend (React)
- **Container**: `support-together-web`
- **Port**: 3000
- **URL**: http://localhost:3000

## Environment Variables

### API Environment Variables

Set in `docker-compose.yml`:

```yaml
NODE_ENV=development
DB_HOST=db
DB_USERNAME=support
DB_PASSWORD=support
DB_NAME=support
PORT=5000
JWT_SECRET=secret_key
ESCALATION_L1_TO_L2_MINUTES=30
ESCALATION_L2_TO_L3_MINUTES=60
```

### Frontend Environment Variables

```yaml
REACT_APP_API_URL=http://localhost:5000/api
CHOKIDAR_USEPOLLING=true
```

## Common Commands

### Build Images

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build api
docker-compose build web
```

### Start Services

```bash
# Start in background
docker-compose up -d

# Start and view logs
docker-compose up

# Start specific service
docker-compose up -d api
```

### Stop Services

```bash
# Stop all services
docker-compose stop

# Stop specific service
docker-compose stop api
```

### Remove Containers

```bash
# Remove stopped containers
docker-compose rm

# Remove containers and volumes
docker-compose down -v
```

### Execute Commands in Containers

```bash
# Run command in API container
docker-compose exec api npm test

# Access API container shell
docker-compose exec api sh

# Access database
docker-compose exec db mysql -u support -psupport support
```

### View Container Status

```bash
docker-compose ps
```

## Database Access

### From Host Machine

```bash
mysql -h localhost -P 3306 -u support -psupport support
```

### From Docker Container

```bash
docker-compose exec db mysql -u support -psupport support
```

### Using MySQL Client

- **Host**: localhost
- **Port**: 3306
- **Database**: support
- **Username**: support
- **Password**: support

## Troubleshooting

### Port Already in Use

If ports 3000, 5000, or 3306 are already in use:

1. Stop the conflicting service
2. Or change ports in `docker-compose.yml`:
   ```yaml
   ports:
     - "3001:3000"  # Change host port
   ```

### Database Connection Issues

1. Check if database is healthy:
   ```bash
   docker-compose ps
   ```

2. Check database logs:
   ```bash
   docker-compose logs db
   ```

3. Wait for database to be ready (healthcheck ensures this)

### API Not Starting

1. Check API logs:
   ```bash
   docker-compose logs api
   ```

2. Verify database connection:
   ```bash
   docker-compose exec api node -e "require('./db').authenticate().then(() => console.log('Connected')).catch(e => console.error(e))"
   ```

### Frontend Not Connecting to API

1. Verify API is running:
   ```bash
   curl http://localhost:5000/api
   ```

2. Check environment variable:
   ```bash
   docker-compose exec web printenv REACT_APP_API_URL
   ```

3. Rebuild frontend if needed:
   ```bash
   docker-compose build web
   docker-compose up -d web
   ```

### Volume Permission Issues

If you encounter permission issues with volumes:

```bash
# Fix permissions (Linux/Mac)
sudo chown -R $USER:$USER node-api/uploads
```

### Clean Rebuild

If you need to start fresh:

```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker-compose rm -f

# Rebuild and start
docker-compose build --no-cache
docker-compose up -d
```

## Development Workflow

### Hot Reload

Both API and frontend support hot reload with volume mounts:
- Changes to code are automatically reflected
- No need to rebuild containers

### Running Tests

```bash
# Run API tests
docker-compose exec api npm test

# Run quick test
docker-compose exec api npm run test:quick
```

### Database Migrations

The database will auto-sync models on API startup. For manual migrations:

```bash
docker-compose exec api node -e "require('./db').sync({force: false})"
```

## Production Considerations

### Security

1. **Change default passwords** in production
2. **Use strong JWT secret**
3. **Enable SSL/TLS**
4. **Restrict database access**
5. **Use environment variables** for secrets

### Performance

1. **Use production builds** for frontend
2. **Enable database connection pooling**
3. **Use Redis** for caching
4. **Configure proper resource limits**

### Example Production Overrides

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  api:
    environment:
      - NODE_ENV=production
      - DB_HOST=${DB_HOST}
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
    # Remove volumes for production
    # volumes: []

  web:
    build:
      context: ./react-web
      dockerfile: Dockerfile.prod
    environment:
      - REACT_APP_API_URL=${API_URL}
```

## File Structure

```
support-together/
├── docker-compose.yml          # Main compose file
├── .dockerignore              # Root ignore file
├── node-api/
│   ├── Dockerfile            # API Dockerfile
│   └── .dockerignore         # API ignore file
├── react-web/
│   ├── Dockerfile            # Frontend Dockerfile
│   └── .dockerignore         # Frontend ignore file
└── test-data.sql             # Database initialization script
```

## Network

All services are on the `support-network` bridge network:
- Services can communicate using service names (e.g., `db`, `api`)
- Database hostname: `db` (from API container)
- API hostname: `api` (from frontend container)

## Volumes

### Database Volume
- `db_data`: Persistent MySQL data storage
- Survives container restarts

### Application Volumes
- Code volumes mounted for hot reload
- `node_modules` excluded to prevent conflicts

## Health Checks

Database has a health check to ensure it's ready before API starts:
- Checks every 10 seconds
- 5 retries before marking unhealthy

## Next Steps

1. **Access the application**: http://localhost:3000
2. **API documentation**: http://localhost:5000/api
3. **Check logs**: `docker-compose logs -f`
4. **Run tests**: `docker-compose exec api npm test`

## Support

For issues:
1. Check logs: `docker-compose logs`
2. Verify containers: `docker-compose ps`
3. Check network: `docker network ls`
4. Review this guide's troubleshooting section
