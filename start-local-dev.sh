#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Flight App - Local Development Startup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running!${NC}"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

# Start infrastructure
echo -e "${YELLOW}Step 1: Starting infrastructure services...${NC}"
docker-compose -f docker-compose-dev.yml up -d

echo ""
echo -e "${YELLOW}Step 2: Waiting for infrastructure to be ready...${NC}"
sleep 10

echo ""
echo -e "${YELLOW}Step 3: Creating databases...${NC}"
docker exec -i flight-mysql-dev mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS flight_db; CREATE DATABASE IF NOT EXISTS flightapp_auth;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Databases created successfully${NC}"
else
    echo -e "${RED}✗ Failed to create databases${NC}"
    echo "You may need to create them manually"
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Infrastructure is ready!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "RabbitMQ Management: http://localhost:15672 (guest/guest)"
echo ""
echo -e "${YELLOW}Now start the services in separate terminals:${NC}"
echo ""
echo "Terminal 1 - Eureka Server:"
echo "  cd eureka-server && mvn spring-boot:run -Dspring-boot.run.profiles=local"
echo ""
echo "Terminal 2 - Auth Service:"
echo "  cd auth-service && mvn spring-boot:run -Dspring-boot.run.profiles=local"
echo ""
echo "Terminal 3 - Flight Service:"
echo "  cd flight-service && mvn spring-boot:run -Dspring-boot.run.profiles=local"
echo ""
echo "Terminal 4 - Booking Service:"
echo "  cd booking-service && mvn spring-boot:run -Dspring-boot.run.profiles=local"
echo ""
echo "Terminal 5 - Notification Service:"
echo "  cd notification-service && mvn spring-boot:run -Dspring-boot.run.profiles=local"
echo ""
echo "Terminal 6 - API Gateway:"
echo "  cd api-gateway && mvn spring-boot:run -Dspring-boot.run.profiles=local"
echo ""
