#!/bin/bash

# Docker Startup Script for Support Together
# This script helps start the application in Docker

echo "=========================================="
echo "Support Together - Docker Setup"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker Compose is available"
echo ""

# Stop existing containers if any
echo "Stopping existing containers..."
docker-compose down

echo ""
echo "Building Docker images..."
docker-compose build

echo ""
echo "Starting services..."
docker-compose up -d

echo ""
echo "Waiting for services to be ready..."
sleep 10

echo ""
echo "=========================================="
echo "Services Status:"
echo "=========================================="
docker-compose ps

echo ""
echo "=========================================="
echo "Application URLs:"
echo "=========================================="
echo "Frontend:  http://localhost:3000"
echo "API:       http://localhost:5000/api"
echo "Database:  localhost:3306"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop:      docker-compose down"
echo "=========================================="
