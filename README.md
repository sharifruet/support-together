# Support Together

Support Desk Application

## Quick Start with Docker

The easiest way to run the entire application:

### Windows
```bash
start-docker.bat
```

### Linux/Mac
```bash
chmod +x start-docker.sh
./start-docker.sh
```

### Manual Start
```bash
docker-compose up -d
```

## Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000/api
- **Database**: localhost:3306

## Services

1. **Database** (MySQL) - Port 3306
2. **API** (Node.js) - Port 5000
3. **Frontend** (React) - Port 3000

## Default Credentials

- **Database**: 
  - User: `support`
  - Password: `support`
  - Database: `support`

## Documentation

- `DOCKER_SETUP.md` - Complete Docker setup guide
- `REQUIREMENTS_ANALYSIS.md` - Requirements vs implementation
- `ROLE_BASED_AUTHORIZATION.md` - Authorization documentation
- `ESCALATION_TIMERS.md` - Escalation system documentation
- `FRONTEND_UPDATES.md` - Frontend changes summary

## Development

### Without Docker

**Backend:**
```bash
cd node-api
npm install
npm start
```

**Frontend:**
```bash
cd react-web
npm install
npm start
```

## Stop Docker Services

```bash
docker-compose down
```

For detailed information, see `DOCKER_SETUP.md`.
