# Flight Booking Microservices Application

A comprehensive microservices-based flight booking application built with Spring Boot WebFlux, featuring service discovery, API gateway, circuit breakers, and message-driven email notifications.

## Architecture Overview

This application follows a microservices architecture with the following components:

### Microservices
- **Eureka Server** (Port 8761) - Service Discovery
- **API Gateway** (Port 8080) - Entry point with JWT authentication
- **Flight Service** (Port 8081) - Flight inventory management (MySQL)
- **Booking Service** (Port 8082) - Booking management (MongoDB)

### Infrastructure
- **MySQL** (Port 3306) - Flight inventory database
- **MongoDB** (Port 27017) - Booking database
- **RabbitMQ** (Port 5672, Management: 15672) - Message broker for email notifications

### Key Features
- JWT-based authentication and authorization
- Service-to-service communication using OpenFeign
- Circuit breaker pattern with Resilience4j
- Reactive programming with Spring WebFlux
- Message-driven email notifications via RabbitMQ
- Comprehensive testing (Unit, Integration, Load)
- Code quality analysis with SonarQube
- Complete Docker containerization

## Project Structure

```
flightapp-docker/
├── eureka-server/              # Service Discovery Server
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── api-gateway/                # API Gateway with JWT Security
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── com/flightapp/gateway/
│   │               ├── filter/JwtAuthenticationFilter.java
│   │               ├── util/JwtUtil.java
│   │               └── config/GatewayConfig.java
│   ├── Dockerfile
│   └── pom.xml
├── flight-service/             # Flight Inventory Service
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/flightapp/flight/
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       ├── repository/
│   │   │   │       ├── entity/
│   │   │   │       └── dto/
│   │   │   └── resources/
│   │   │       ├── schema.sql
│   │   │       └── data.sql
│   │   └── test/
│   ├── Dockerfile
│   ├── pom.xml
│   └── sonar-project.properties
├── booking-service/            # Booking Service
│   ├── src/
│   │   ├── main/
│   │   │   └── java/
│   │   │       └── com/flightapp/booking/
│   │   │           ├── controller/
│   │   │           ├── service/
│   │   │           ├── repository/
│   │   │           ├── entity/
│   │   │           ├── dto/
│   │   │           ├── config/FlightServiceClient.java
│   │   │           └── messaging/
│   │   └── test/
│   ├── Dockerfile
│   ├── pom.xml
│   └── sonar-project.properties
├── jmeter-tests/               # JMeter Load Tests
│   └── FlightApp-TestPlan.jmx
├── postman/                    # Postman Collection
│   └── FlightApp-Postman-Collection.json
├── docker-compose.yml          # Docker Compose Configuration
├── run-tests.sh               # Test execution script (Linux/Mac)
├── run-tests.bat              # Test execution script (Windows)
└── README.md                  # This file
```

## Prerequisites

- Java 17 or higher
- Maven 3.8+
- Docker and Docker Compose
- (Optional) Postman or Newman for API testing
- (Optional) Apache JMeter for load testing
- (Optional) SonarQube for code quality analysis

## Getting Started

### 1. Clone the Repository

```bash
cd flightapp-docker
```

### 2. Build and Run with Docker Compose

The easiest way to run the entire application is using Docker Compose:

```bash
docker-compose up --build
```

This command will:
- Build all microservices
- Start MySQL, MongoDB, and RabbitMQ
- Start Eureka Server
- Start Flight Service and Booking Service
- Start API Gateway

**Wait for all services to be healthy** (approximately 2-3 minutes)

### 3. Verify Services

Check if all services are running:

- Eureka Dashboard: http://localhost:8761
- API Gateway: http://localhost:8080
- Flight Service: http://localhost:8081/actuator/health
- Booking Service: http://localhost:8082/actuator/health
- RabbitMQ Management: http://localhost:15672 (guest/guest)

## API Usage

### Authentication

#### 1. Register a New User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "password123",
    "email": "newuser@example.com"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "newuser",
  "message": "User registered successfully"
}
```

#### 2. Login and Obtain JWT Token

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "message": "Login successful"
}
```

**Use this token in the Authorization header for all subsequent requests:**
```
Authorization: Bearer <your-token>
```

#### 3. Validate Token (POST)

```bash
curl -X POST http://localhost:8080/api/auth/validate \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your-jwt-token-here"
  }'
```

#### 4. Validate Token (GET)

```bash
curl -X GET http://localhost:8080/api/auth/validate \
  -H "Authorization: Bearer <your-token>"
```

### Flight Service APIs

#### 1. Search Flights

```bash
curl -X POST http://localhost:8080/api/flights/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "origin": "DEL",
    "destination": "BOM",
    "travelDate": "2025-12-15"
  }'
```

#### 2. Add Flight Inventory

```bash
curl -X POST http://localhost:8080/api/flights/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "flightNumber": "AI999",
    "airline": "Air India",
    "origin": "DEL",
    "destination": "BLR",
    "departureTime": "2025-12-20T08:00:00",
    "arrivalTime": "2025-12-20T11:00:00",
    "availableSeats": 200,
    "price": 6500.00
  }'
```

#### 3. Get Flight by ID

```bash
curl -X GET http://localhost:8080/api/flights/inventory/1 \
  -H "Authorization: Bearer <your-token>"
```

#### 4. Reduce Available Seats

```bash
curl -X PUT "http://localhost:8080/api/flights/inventory/1/reduce-seats?seats=2" \
  -H "Authorization: Bearer <your-token>"
```

Response: `true` (if successful) or `false` (if failed)

#### 5. Restore Seats (After Cancellation)

```bash
curl -X PUT "http://localhost:8080/api/flights/inventory/1/restore-seats?seats=2" \
  -H "Authorization: Bearer <your-token>"
```

Response: `true` (if successful) or `false` (if failed)

### Booking Service APIs

#### 1. Create Booking

```bash
curl -X POST http://localhost:8080/api/bookings/book \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "flightId": 1,
    "passengerName": "John Doe",
    "passengerEmail": "john@example.com",
    "passengerPhone": "9876543210",
    "numberOfSeats": 2
  }'
```

Response:
```json
{
  "pnr": "PNR12AB34CD",
  "flightNumber": "AI101",
  "passengerName": "John Doe",
  "numberOfSeats": 2,
  "totalAmount": 10000.00,
  "status": "CONFIRMED",
  "bookingDate": "2025-12-06T10:30:00",
  "message": "Booking created successfully"
}
```

**Email notification will be sent to RabbitMQ queue automatically!**

#### 2. Get Booking by PNR

```bash
curl -X GET http://localhost:8080/api/bookings/pnr/PNR12AB34CD \
  -H "Authorization: Bearer <your-token>"
```

#### 3. Cancel Booking

```bash
curl -X DELETE http://localhost:8080/api/bookings/cancel/PNR12AB34CD \
  -H "Authorization: Bearer <your-token>"
```

## Testing

### Run All Tests

#### On Linux/Mac:
```bash
chmod +x run-tests.sh
./run-tests.sh all
```

#### On Windows:
```cmd
run-tests.bat all
```

### Run Specific Tests

#### Unit Tests with Coverage
```bash
./run-tests.sh unit          # Linux/Mac
run-tests.bat unit           # Windows
```

Coverage reports will be generated at:
- `flight-service/target/site/jacoco/index.html`
- `booking-service/target/site/jacoco/index.html`

#### Postman API Tests
```bash
# Install Newman first
npm install -g newman

./run-tests.sh postman       # Linux/Mac
run-tests.bat postman        # Windows
```

Report: `postman-report.html`

#### JMeter Load Tests
```bash
./run-tests.sh jmeter        # Linux/Mac
run-tests.bat jmeter         # Windows
```

HTML Report: `jmeter-html-report/index.html`

#### SonarQube Analysis
```bash
# Start SonarQube first
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest

# Set SONAR_TOKEN environment variable
export SONAR_TOKEN=your_sonar_token

./run-tests.sh sonar         # Linux/Mac
run-tests.bat sonar          # Windows
```

## Code Quality & Coverage

### Running SonarQube Locally

1. Start SonarQube:
```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
```

2. Access SonarQube at http://localhost:9000 (admin/admin)

3. Create a project and generate a token

4. Run analysis:
```bash
cd flight-service
mvn clean test jacoco:report sonar:sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=your_token

cd ../booking-service
mvn clean test jacoco:report sonar:sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=your_token
```

## Circuit Breaker & Resilience

The application implements circuit breakers using Resilience4j:

- **Flight Service**: Circuit breaker for database operations
- **Booking Service**: Circuit breaker for flight service calls and database operations

### Circuit Breaker Configuration
```yaml
resilience4j:
  circuitbreaker:
    instances:
      bookingService:
        slidingWindowSize: 10
        minimumNumberOfCalls: 5
        failureRateThreshold: 50
        waitDurationInOpenState: 5s
```

### Testing Circuit Breaker

1. Stop the Flight Service:
```bash
docker stop flight-service
```

2. Try to create a booking - you'll get a fallback response:
```json
{
  "message": "Service temporarily unavailable. Please try again later.",
  "status": "FAILED"
}
```

3. Check circuit breaker status:
```bash
curl http://localhost:8082/actuator/circuitbreakers
```

## RabbitMQ Email Notifications

### How It Works

1. When a booking is created, the Booking Service publishes an email notification to RabbitMQ
2. The EmailConsumer listens to the queue and processes notifications
3. Email details are logged (in production, actual emails would be sent)

### Monitor RabbitMQ

- Access RabbitMQ Management UI: http://localhost:15672
- Login: guest/guest
- Check the "email.queue" for messages

### View Email Logs

```bash
docker logs booking-service | grep "Email"
```

## Stopping the Application

```bash
docker-compose down
```

To remove volumes (databases):
```bash
docker-compose down -v
```

## Development Mode

### Running Services Locally (without Docker)

1. Start MySQL:
```bash
docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=flight_db mysql:8.0
```

2. Start MongoDB:
```bash
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root mongo:7.0
```

3. Start RabbitMQ:
```bash
docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management
```

4. Start Eureka Server:
```bash
cd eureka-server
mvn spring-boot:run
```

5. Start Flight Service:
```bash
cd flight-service
mvn spring-boot:run
```

6. Start Booking Service:
```bash
cd booking-service
mvn spring-boot:run
```

7. Start API Gateway:
```bash
cd api-gateway
mvn spring-boot:run
```

## Recent Fixes

### 1. Build Compilation Error - Flight Service Tests
**Issue**: Docker build was failing during test compilation with errors about missing `AuthRequest` and `AuthResponse` classes.

**Root Cause**: The `flight-service/src/test/java/com/flightapp/flight/DtoAndEntityTest.java` file contained tests for `AuthRequest` and `AuthResponse` classes, which belong to the `auth-service`, not the `flight-service`. In a microservices architecture, each service should only test its own components.

**Resolution**: Removed the following auth-related test methods from `DtoAndEntityTest.java`:
- `testAuthRequest_AllArgsConstructor()`
- `testAuthResponse_Builder()`
- `testAuthResponse_NoArgsConstructor()`
- `testAuthRequest_NoArgsConstructor()`

**Files Changed**:
- `flight-service/src/test/java/com/flightapp/flight/DtoAndEntityTest.java` (Lines 115-156 removed)

The test file now only contains tests for DTOs that actually exist in the flight-service:
- `FlightInventory` (entity)
- `FlightInventoryRequest` (DTO)
- `FlightSearchRequest` (DTO)

### 2. Postman Collection Update - Complete API Coverage
**Issue**: The Postman collection was missing several API endpoints that exist in the microservices.

**Resolution**: Updated the Postman collection to include all available endpoints:

**Added Authentication Endpoints**:
- `POST /api/auth/register` - Register new users
- `POST /api/auth/validate` - Validate JWT token (body)
- `GET /api/auth/validate` - Validate JWT token (header)

**Added Flight Service Endpoints**:
- `PUT /api/flights/inventory/{id}/reduce-seats` - Reduce available seats
- `PUT /api/flights/inventory/{id}/restore-seats` - Restore seats after cancellation

**Files Changed**:
- `postman/FlightApp-Postman-Collection.json` - Added 5 new API endpoints

The Postman collection now includes all 12 API endpoints available across the microservices architecture.

### 3. API Gateway Dependency Issue - Removed Notification Service Dependency
**Issue**: The api-gateway was not starting automatically with `docker-compose up` even though it was configured correctly.

**Root Cause**:
- The api-gateway had a dependency on `notification-service` being healthy before starting
- The notification-service was unhealthy due to Gmail authentication failure in its mail health check
- Since notification-service never became healthy, api-gateway remained in "Created" state and never started

**Why the Notification Service Was Unhealthy**:
- Spring Boot Actuator includes a mail health check by default
- The configured Gmail credentials in docker-compose.yml were invalid or the account didn't have App Passwords enabled
- Health check kept failing: `AuthenticationFailedException: Username and Password not accepted`

**Resolution**:
- Removed `notification-service` from api-gateway's `depends_on` configuration
- The api-gateway doesn't actually need to wait for notification-service since:
  - Notification service is only used by booking-service via RabbitMQ
  - API Gateway routes requests but doesn't directly communicate with notification-service
  - Service discovery (Eureka) handles dynamic service registration

**Files Changed**:
- `docker-compose.yml` - Removed notification-service dependency from api-gateway (lines 272-273)

**Impact**: Now api-gateway will start as soon as eureka-server, auth-service, flight-service, and booking-service are healthy, regardless of notification-service status.

**Note**: To fix the notification-service mail issue (if email functionality is needed):
1. Enable "App Passwords" in your Gmail account settings
2. Update the mail credentials in docker-compose.yml with the app password
3. Or disable mail health check by adding to notification-service environment:
   ```yaml
   MANAGEMENT_HEALTH_MAIL_ENABLED: false
   ```

## Troubleshooting

### Services not starting
- Check if ports are already in use
- Ensure Docker has enough memory (minimum 4GB recommended)
- Check logs: `docker-compose logs <service-name>`

### JWT token expired
- Generate a new token using the /api/auth/login endpoint

### Database connection issues
- Wait for health checks to pass
- Check database containers: `docker ps`
- Check logs: `docker logs flight-mysql` or `docker logs booking-mongodb`

### RabbitMQ connection issues
- Verify RabbitMQ is running: `docker ps | grep rabbitmq`
- Check RabbitMQ logs: `docker logs rabbitmq`

## Technology Stack

- **Backend Framework**: Spring Boot 3.2.0, Spring WebFlux
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Security**: JWT (JSON Web Tokens)
- **Databases**: MySQL (Flight Service), MongoDB (Booking Service)
- **Message Broker**: RabbitMQ
- **Inter-Service Communication**: OpenFeign
- **Resilience**: Resilience4j Circuit Breaker
- **Testing**: JUnit 5, Mockito, Reactor Test
- **Load Testing**: Apache JMeter
- **API Testing**: Postman/Newman
- **Code Quality**: SonarQube, JaCoCo
- **Containerization**: Docker, Docker Compose

## API Endpoints Summary

| Service | Method | Endpoint | Authentication | Description |
|---------|--------|----------|----------------|-------------|
| Auth | POST | /api/auth/login | No | Login and get JWT token |
| Auth | POST | /api/auth/register | No | Register a new user |
| Auth | POST | /api/auth/validate | No | Validate JWT token (body) |
| Auth | GET | /api/auth/validate | Yes | Validate JWT token (header) |
| Flight | POST | /api/flights/search | Yes | Search available flights |
| Flight | POST | /api/flights/add | Yes | Add new flight inventory |
| Flight | GET | /api/flights/inventory/{id} | Yes | Get flight by ID |
| Flight | PUT | /api/flights/inventory/{id}/reduce-seats | Yes | Reduce available seats |
| Flight | PUT | /api/flights/inventory/{id}/restore-seats | Yes | Restore seats after cancellation |
| Booking | POST | /api/bookings/book | Yes | Create a new booking |
| Booking | GET | /api/bookings/pnr/{pnr} | Yes | Get booking details by PNR |
| Booking | DELETE | /api/bookings/cancel/{pnr} | Yes | Cancel a booking |

## License

This project is created for educational purposes.

## Support

For issues and questions, please check the logs and verify all services are healthy.

## Contributors

Built with Spring Boot WebFlux, Spring Cloud, and modern microservices patterns.
