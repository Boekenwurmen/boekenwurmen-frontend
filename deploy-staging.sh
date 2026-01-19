#!/bin/bash

# Boekenwurmen Staging Deployment Script
# This script deploys the staging/develop version of the application

set -e  # Exit on error

echo "🧪 Boekenwurmen Staging Deployment Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Pull latest changes from develop branch for both repos
echo "📥 Pulling latest changes from develop branch..."

# Pull frontend
if [ -d ".git" ]; then
    echo "  → Pulling frontend (develop branch)..."
    git fetch origin develop
    git checkout develop
    git pull origin develop
    echo -e "${GREEN}  ✓ Frontend updated to develop${NC}"
else
    echo -e "${YELLOW}  ⚠ Not a git repository, skipping frontend pull${NC}"
fi

# Pull backend
if [ -d "../boekenwurmen-backend/.git" ]; then
    echo "  → Pulling backend (develop branch)..."
    cd ../boekenwurmen-backend
    git fetch origin develop
    git checkout develop
    git pull origin develop
    cd ../boekenwurmen-frontend
    echo -e "${GREEN}  ✓ Backend updated to develop${NC}"
else
    echo -e "${YELLOW}  ⚠ Backend repository not found at ../boekenwurmen-backend${NC}"
    echo -e "${YELLOW}  ⚠ Make sure both repos are cloned as siblings${NC}"
fi
echo ""

# Check for frontend .env.staging file
echo "📋 Checking environment files..."
if [ ! -f ".env.staging" ]; then
    echo -e "${YELLOW}⚠ No frontend .env.staging file found${NC}"
    echo "Creating frontend .env.staging from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.staging
        echo -e "${GREEN}✓ Created frontend .env.staging file${NC}"
        echo -e "${YELLOW}⚠ Please edit frontend .env.staging file with your staging configuration${NC}"
    else
        echo -e "${RED}❌ No frontend .env.example found${NC}"
        exit 1
    fi
fi

# Check for backend .env.staging file
if [ ! -f "../boekenwurmen-backend/.env.staging" ]; then
    echo -e "${YELLOW}⚠ No backend .env.staging file found${NC}"
    echo "Creating backend .env.staging from .env.example..."
    if [ -f "../boekenwurmen-backend/.env.example" ]; then
        cp ../boekenwurmen-backend/.env.example ../boekenwurmen-backend/.env.staging
        echo -e "${GREEN}✓ Created backend .env.staging file${NC}"
        echo -e "${YELLOW}⚠ Please edit backend .env.staging file with your staging configuration${NC}"
    else
        echo -e "${RED}❌ No backend .env.example found${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ Environment files ready${NC}"
echo ""

# Stop existing staging containers
echo "🛑 Stopping existing staging containers..."
docker compose -f docker-compose.staging.yml down || true
echo -e "${GREEN}✓ Staging containers stopped${NC}"
echo ""

# Pull latest develop images from GitHub Container Registry
echo "📥 Pulling latest develop images from ghcr.io..."
echo -e "${BLUE}Images will be tagged with 'develop'${NC}"
docker compose -f docker-compose.staging.yml pull

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Develop images pulled successfully${NC}"
else
    echo -e "${RED}❌ Failed to pull images${NC}"
    echo -e "${YELLOW}⚠ Make sure you're logged in to ghcr.io or the images are public${NC}"
    echo -e "${YELLOW}⚠ Also verify that develop branch has been pushed and built in GitHub Actions${NC}"
    exit 1
fi
echo ""

# Start staging containers with develop images
echo "🚀 Starting staging containers..."
echo -e "${BLUE}Staging will run on different ports:${NC}"
echo -e "  ${BLUE}→ Frontend: http://localhost:3001${NC}"
echo -e "  ${BLUE}→ Backend: http://localhost:3013${NC}"
echo ""
docker compose -f docker-compose.staging.yml up -d

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Staging containers started successfully${NC}"
else
    echo -e "${RED}❌ Failed to start containers${NC}"
    exit 1
fi
echo ""

# Wait for containers to be healthy
echo "⏳ Waiting for containers to be ready..."
sleep 5

# Check container status
echo "📊 Staging container status:"
docker compose -f docker-compose.staging.yml ps
echo ""

# Show logs
echo "📝 Recent logs:"
docker compose -f docker-compose.staging.yml logs --tail=20
echo ""

echo -e "${GREEN}✅ Staging deployment completed!${NC}"
echo ""
echo "📌 Next steps:"
echo "  - Check logs: docker compose -f docker-compose.staging.yml logs -f"
echo "  - Check status: docker compose -f docker-compose.staging.yml ps"
echo "  - Restart: docker compose -f docker-compose.staging.yml restart"
echo "  - Stop: docker compose -f docker-compose.staging.yml down"
echo ""
echo "🌐 Your staging application is running on:"
echo "  - Frontend: http://localhost:3001"
echo "  - Backend: http://localhost:3013"
echo ""
echo -e "${YELLOW}⚠ Note: This is the STAGING environment using develop branch images${NC}"
echo -e "${BLUE}💡 Production runs on ports 3000 (frontend) and 3012 (backend)${NC}"
echo ""
