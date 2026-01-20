# Docker Quick Start

## 🚀 Start Everything

### Option 1: Use Startup Scripts

**Windows:**
```bash
start-docker.bat
```

**Linux/Mac:**
```bash
chmod +x start-docker.sh
./start-docker.sh
```

### Option 2: Manual Start

```bash
docker-compose up -d
```

## 📍 Access URLs

- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000/api
- **Database**: localhost:3306

## 🛑 Stop Services

```bash
docker-compose down
```

## 📊 View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f db
```

## 🔧 Common Commands

```bash
# Rebuild after code changes
docker-compose build
docker-compose up -d

# Restart a service
docker-compose restart api

# View running containers
docker-compose ps

# Execute command in container
docker-compose exec api npm test
```

## ⚠️ Troubleshooting

**Port conflicts?** Change ports in `docker-compose.yml`

**Database not ready?** Wait 30 seconds for health check

**Need clean start?**
```bash
docker-compose down -v
docker-compose up -d
```

For detailed information, see `DOCKER_SETUP.md`.
