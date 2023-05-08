FROM openjdk:19-jdk-slim

WORKDIR /app

COPY . .

RUN ./mvnw package

CMD ["java", "-jar", "target/EmailMarketinService-0.0.1-SNAPSHOT.jar"]