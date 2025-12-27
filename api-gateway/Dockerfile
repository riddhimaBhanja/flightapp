FROM maven:3.8.5-openjdk-17

WORKDIR /api-gateway

COPY api-gateway/target/api-gateway-1.0.0.jar app.jar

CMD ["java","-jar","app.jar"]
