FROM maven:3.8.5-openjdk-17

WORKDIR /notification-service

COPY notification-service/target/notification-service-1.0.0.jar app.jar

CMD ["java","-jar","app.jar"]
