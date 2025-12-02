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

# Pull latest changes for both repos
echo "📥 Pulling latest changes from git..."

# Pull frontend
if [ -d ".git" ]; then
    echo "  → Pulling frontend..."
    git pull
    echo -e "${GREEN}  ✓ Frontend updated${NC}"
else
    echo -e "${YELLOW}  ⚠ Not a git repository, skipping frontend pull${NC}"
fi

# Pull backend
if [ -d "../boekenwurmen-backend/.git" ]; then
    echo "  → Pulling backend..."
    cd ../boekenwurmen-backend
    git pull
    cd ../boekenwurmen-frontend
    echo -e "${GREEN}  ✓ Backend updated${NC}"
else
    echo -e "${YELLOW}  ⚠ Backend repository not found at ../boekenwurmen-backend${NC}"
    echo -e "${YELLOW}  ⚠ Make sure both repos are cloned as siblings${NC}"
fi
echo ""

# Check for frontend .env file
echo "📋 Checking environment files..."
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠ No frontend .env file found${NC}"
    echo "Creating frontend .env from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Created frontend .env file${NC}"
        echo -e "${YELLOW}⚠ Please edit frontend .env file with your configuration${NC}"
    else
        echo -e "${RED}❌ No frontend .env.example found${NC}"
        exit 1
    fi
fi

# Check for backend .env file
if [ ! -f "../boekenwurmen-backend/.env" ]; then
    echo -e "${YELLOW}⚠ No backend .env file found${NC}"
    echo "Creating backend .env from .env.example..."
    if [ -f "../boekenwurmen-backend/.env.example" ]; then
        cp ../boekenwurmen-backend/.env.example ../boekenwurmen-backend/.env
        echo -e "${GREEN}✓ Created backend .env file${NC}"
        echo -e "${YELLOW}⚠ Please edit backend .env file with your configuration${NC}"
    else
        echo -e "${RED}❌ No backend .env.example found${NC}"
        exit 1
    fi
fi

# If any .env files were created, pause for user to configure them
if [ ! -f ".env" ] || [ ! -f "../boekenwurmen-backend/.env" ]; then
    echo ""
    echo -e "${YELLOW}⚠ Please review and edit the .env files before continuing${NC}"
    echo "  - Frontend: .env"
    echo "  - Backend: ../boekenwurmen-backend/.env"
    echo ""
    echo "Press Enter when ready to continue..."
    read
fi

echo -e "${GREEN}✓ Environment files ready${NC}"
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
