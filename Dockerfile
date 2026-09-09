FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend-react/package*.json ./
RUN npm install
COPY frontend-react/ ./
RUN npm run build

FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY ["SIH 2026/pom.xml", "./"]
RUN mvn -B dependency:go-offline
COPY ["SIH 2026/src", "./src"]
COPY --from=frontend-build /frontend/dist ./src/main/resources/static
RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend-build /app/target/learning-platform-1.0.0-SNAPSHOT.jar app.jar
EXPOSE 10000
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75"
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
