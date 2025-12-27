# Spring Cloud Config Repository

This directory contains centralized configuration files for all microservices in the Flight App platform.

## Configuration Files

### Base Configuration Files
These files contain the default configuration for each microservice:

1. **eureka-server.properties** - Service discovery server configuration
2. **api-gateway.properties** - API Gateway routing and security configuration
3. **auth-service.properties** - Authentication service with MySQL database
4. **flight-service.properties** - Flight inventory service with MySQL database
5. **booking-service.properties** - Booking service with MongoDB and RabbitMQ
6. **notification-service.properties** - Email notification service with MongoDB

### Environment-Specific Configuration Files
These files contain environment-specific overrides for Docker deployment:

1. **eureka-server-docker.properties**
2. **api-gateway-docker.properties**
3. **auth-service-docker.properties**
4. **flight-service-docker.properties**
5. **booking-service-docker.properties**
6. **notification-service-docker.properties**

## How to Use

### With Spring Cloud Config Server

1. Set up a Spring Cloud Config Server pointing to this directory
2. In each microservice, add the following dependency:
   ```xml
   <dependency>
       <groupId>org.springframework.cloud</groupId>
       <artifactId>spring-cloud-starter-config</artifactId>
   </dependency>
   ```

3. Create a `bootstrap.yml` or `bootstrap.properties` in each microservice:
   ```yaml
   spring:
     application:
       name: service-name  # Must match the config file name
     cloud:
       config:
         uri: http://localhost:8888  # Config server URL
         fail-fast: true
     profiles:
       active: docker  # Use docker profile for Docker environment
   ```

### Configuration Profiles

- **default**: Local development configuration (localhost)
- **docker**: Docker container configuration (service names as hosts)

### File Naming Convention

Spring Cloud Config uses the following naming pattern:
```
{application-name}.properties           # Default profile
{application-name}-{profile}.properties # Specific profile
```

## Configuration Override Priority

From highest to lowest priority:
1. Environment variables
2. Profile-specific properties (`-docker.properties`)
3. Default properties (`.properties`)
4. Application defaults

## Key Configuration Areas

### Database Configuration
- **MySQL Services**: auth-service, flight-service
- **MongoDB Services**: booking-service, notification-service

### Message Broker
- **RabbitMQ**: booking-service (for async notification)

### Service Discovery
- All services register with Eureka Server at port 8761

### Security
- JWT-based authentication with shared secret across services
- API Gateway handles authentication for all routes

### Resilience
- Circuit breaker patterns configured for flight-service and booking-service
- Feign client timeouts configured for inter-service communication

## Notes

- Sensitive data (passwords, secrets) should be externalized using environment variables
- The mail credentials in notification-service should be replaced with actual values or use environment variables
- For production, consider using encrypted properties with Spring Cloud Config encryption
