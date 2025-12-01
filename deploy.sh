#!/bin/bash

# Boekenwurmen Deployment Script
# This script helps deploy the application to a Digital Ocean droplet

set -e  # Exit on error

echo "🚀 Boekenwurmen Deployment Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on server or local
if [ -f "/.dockerenv" ] || [ -f "/run/.containerenv" ]; then
    echo -e "${YELLOW}Running inside a container${NC}"
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required commands
echo "📋 Checking prerequisites..."
if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker first: https://docs.docker.com/engine/install/"
    exit 1
fi

if ! command_exists git; then
    echo -e "${RED}❌ Git is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}"
echo ""

# Pull latest changes
echo "📥 Pulling latest changes from git..."
if [ -d ".git" ]; then
    git pull
    echo -e "${GREEN}✓ Git pull completed${NC}"
else
    echo -e "${YELLOW}⚠ Not a git repository, skipping pull${NC}"
fi
echo ""

# Check for .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠ No .env file found${NC}"
    echo "Creating .env from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Created .env file${NC}"
        echo -e "${YELLOW}⚠ Please edit .env file with your configuration before continuing${NC}"
        echo "Press Enter when ready to continue..."
        read
    else
        echo -e "${RED}❌ No .env.example found${NC}"
        exit 1
    fi
fi
echo ""

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose down || true
echo -e "${GREEN}✓ Containers stopped${NC}"
echo ""

# Build and start containers
echo "🔨 Building and starting containers..."
docker compose up -d --build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Containers built and started successfully${NC}"
else
    echo -e "${RED}❌ Failed to start containers${NC}"
    exit 1
fi
echo ""

# Wait for containers to be healthy
echo "⏳ Waiting for containers to be ready..."
sleep 5

# Check container status
echo "📊 Container status:"
docker compose ps
echo ""

# Show logs
echo "📝 Recent logs:"
docker compose logs --tail=20
echo ""

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo "📌 Next steps:"
echo "  - Check logs: docker compose logs -f"
echo "  - Check status: docker compose ps"
echo "  - Restart: docker compose restart"
echo "  - Stop: docker compose down"
echo ""
echo "🌐 Your application should be running on:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend: http://localhost:3012"
echo ""
