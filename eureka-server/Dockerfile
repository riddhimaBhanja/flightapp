FROM maven:3.8.5-openjdk-17

WORKDIR /eureka-server

COPY eureka-server/target/eureka-server-1.0.0.jar app.jar

CMD ["java","-jar","app.jar"]
