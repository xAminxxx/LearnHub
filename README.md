# Training Center Management System

A comprehensive Spring Boot application for managing a training center with students, trainers, courses, enrollments, grades, and schedules.

## Project Structure

```
mini-project-spring/
├── trainingcenter/              # Main Spring Boot project
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/iit/trainingcenter/
│   │   │   │   ├── entity/          # JPA entities (12 classes)
│   │   │   │   ├── repository/      # Spring Data JPA repositories
│   │   │   │   ├── service/         # Business logic services
│   │   │   │   ├── controller/      # REST & Web controllers
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── config/          # Spring configurations
│   │   │   │   ├── exception/       # Custom exceptions
│   │   │   │   └── util/            # Utility classes
│   │   │   └── resources/
│   │   │       ├── application.yml        # Local development config
│   │   │       ├── application-docker.yml # Docker production config
│   │   │       ├── static/          # Static files (CSS, JS, images)
│   │   │       └── templates/       # Thymeleaf templates
│   │   └── test/                # Unit tests
│   ├── pom.xml                  # Maven dependencies
│   ├── mvnw & mvnw.cmd         # Maven wrapper
│   └── target/                  # Compiled output
├── frontend/                    # Angular application (optional)
├── documentation/               # UML diagrams and documentation
│   ├── 01-use-case-diagram.md
│   ├── 02-package-diagram.md
│   ├── 03-class-diagram.md
│   ├── 04-sequence-diagram.md
│   ├── 05-user-stories.md
│   └── diagrams/               # Generated diagram images
├── Dockerfile                   # Docker image for Spring Boot app
├── docker-compose.yml          # Docker Compose for full stack
└── .dockerignore               # Files to exclude from Docker build
```

---

## Prerequisites

- **Java 17+** ([Download](https://www.oracle.com/java/technologies/downloads/#java17))
- **Maven 3.9+** ([Download](https://maven.apache.org/download.cgi))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** (optional, for version control)

---

## Quick Start (Docker Compose - Recommended)

### For New Users (First Time Setup)

After cloning the project:

```powershell
# Navigate to project directory
cd mini-project-spring

# Start all services with single command
docker compose up --build
```

**This will:**

- ✅ Build the Spring Boot Docker image
- ✅ Start MySQL 8.0 container
- ✅ Start the Spring Boot application container
- ✅ Start phpMyAdmin container
- ✅ Create and initialize the database automatically
- ✅ All services communicate via Docker network

### Access the Application

Once all services are running (wait ~30 seconds), open your browser:

| Service             | URL                   | Credentials          |
| ------------------- | --------------------- | -------------------- |
| **Spring Boot App** | http://localhost:8081 | `admin` / `admin123` |
| **phpMyAdmin**      | http://localhost:8080 | `root` / `root`      |
| **MySQL**           | localhost:3306        | `app` / `app`        |

### Stop the Application

Press **Ctrl+C** in the terminal.

---

### For Existing Setup (Restart/Fresh Start)

To clean up and start fresh:

```powershell
docker compose down -v
docker compose up --build
```

This removes all containers and the database volume, giving you a completely clean slate.

---

## Development Mode (Local - Advanced)

If you want to run locally without Docker:

### Step 1: Start MySQL Database

```powershell
docker run -d --name training-db -p 3307:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=training_center mysql:8.0
```

### Step 2: Build & Run Spring Boot

Navigate to the project:

```powershell
cd c:\Users\makni\OneDrive\Bureau\mini-project-spring\trainingcenter
mvn clean package -DskipTests
mvn spring-boot:run
```

Access: http://localhost:8080 with credentials `admin` / `admin123`

---

## Production Deployment (Docker Compose)

### One-Command Deployment

```powershell
docker compose up --build
```

This starts all services in attached mode. Press Ctrl+C to stop.

---

## Default Credentials

The application comes with 3 pre-configured users for different roles:

| Username  | Password     | Role    | Access                      |
| --------- | ------------ | ------- | --------------------------- |
| `admin`   | `admin123`   | ADMIN   | Full system access          |
| `trainer` | `trainer123` | TRAINER | Manage courses and grades   |
| `student` | `student123` | STUDENT | View enrollments and grades |

These are configured in `SecurityConfig.java` using Spring Security's in-memory authentication.

---

## Database Configuration

### Local Development (application.yml)

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3307/training_center
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update # Auto-create tables on startup
```

### Docker Production (application-docker.yml)

```yaml
spring:
  datasource:
    url: jdbc:mysql://db:3306/training_center # Uses Docker network
    username: app
    password: app
```

---

## Project Technologies

| Technology          | Version | Purpose                            |
| ------------------- | ------- | ---------------------------------- |
| **Spring Boot**     | 3.4.x   | Web framework & auto-configuration |
| **Spring Data JPA** | 3.x     | ORM & data access                  |
| **Hibernate**       | 6.6.x   | Object-relational mapping          |
| **MySQL**           | 8.0     | Database                           |
| **Spring Security** | 6.x     | Authentication & authorization     |
| **Thymeleaf**       | 3.x     | Server-side templating             |
| **Maven**           | 3.9.x   | Build & dependency management      |
| **Docker**          | Latest  | Containerization                   |
| **Angular**         | 18+     | Frontend (optional)                |

---

## Troubleshooting

### MySQL Connection Error

**Error:** `Communications link failure`

**Solution:**

1. Check if Docker MySQL is running: `docker ps`
2. Verify port in `application.yml` matches your setup
3. Restart container: `docker restart training-db`

### Port Already in Use

**Error:** `Address already in use: bind`

**Solution:**

```powershell
# Find process using port
netstat -ano | findstr :3307

# Kill process (replace PID)
taskkill /PID <PID> /F
```

Or use different port in `application.yml`:

```yaml
datasource:
  url: jdbc:mysql://localhost:3308/training_center
```

### Build Failures

**Error:** `Compilation failure`

**Solution:**

```powershell
# Clean and rebuild
mvn clean -U install

# Or skip tests
mvn clean package -DskipTests
```

### phpMyAdmin Connection Issues

**Error:** `Cannot connect: invalid settings`

**Solution:**

1. Find MySQL container IP: `docker inspect training-db --format='{{.NetworkSettings.IPAddress}}'`
2. Update phpMyAdmin with correct IP:
   ```powershell
   docker stop phpmyadmin
   docker rm phpmyadmin
   docker run -d --name phpmyadmin -p 8081:80 -e PMA_HOST=<IP> -e PMA_USER=root -e PMA_PASSWORD=root phpmyadmin
   ```
