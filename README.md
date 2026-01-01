# LearnHub / Training Center Management System

A Spring Boot application for managing a training center.

It supports both:

- **Thymeleaf Web UI** (server-rendered pages)
- **REST API** (JSON endpoints)

## Project Structure (current)

```
LearnHub/
├── trainingcenter/                         # Spring Boot application
│   ├── mvnw / mvnw.cmd                     # Maven wrapper
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/iit/trainingcenter/
│       │   │   ├── TrainingCenterApplication.java
│       │   │   ├── config/                 # Spring config (Security/Web/...)
│       │   │   ├── entity/                 # JPA entities
│       │   │   ├── repository/             # Spring Data repositories
│       │   │   ├── service/                # Business logic
│       │   │   ├── util/                   # Utilities / initial data
│       │   │   ├── web/                    # MVC controllers (Thymeleaf pages)
│       │   │   └── restcontroller/         # REST controllers (JSON API)
│       │   └── resources/
│       │       ├── application.yml
│       │       ├── application-docker.yml
│       │       └── templates/              # Thymeleaf templates
│       └── test/
├── docker-compose.yml                      # App + MySQL + phpMyAdmin
├── Dockerfile                              # Multi-stage build for Spring Boot app
└── documentation/                          # UML diagrams and documentation
```

---

## Prerequisites

- **Java 17+**
- **Docker + Docker Compose** (recommended)
- Optional for local runs: Maven, or use the included Maven Wrapper (`./mvnw`)

---

## Quick Start (Docker Compose - recommended)

### For New Users (First Time Setup)

After cloning the project:

docker compose up --build
```bash
# from repo root
docker compose up --build
```

**This will:**

- ✅ Build the Spring Boot Docker image
- ✅ Start MySQL 8.0 container
- ✅ Start the Spring Boot application container
- ✅ Start phpMyAdmin container
- ✅ Create and initialize the database automatically
- ✅ All services communicate via Docker network

### Access

Once all services are running (wait ~30 seconds), open your browser:

| Service | URL | Notes |
| --- | --- | --- |
| Web UI (Thymeleaf) | http://localhost:8085/students | Served by controllers in `web/` |
| REST API | http://localhost:8085/api/students | Served by controllers in `restcontroller/` |
| phpMyAdmin | http://localhost:8082 | MySQL UI |
| MySQL | localhost:3306 | user/pass: `app` / `app` |

### Stop the Application

Press **Ctrl+C** in the terminal.

---

### Reset (fresh DB)

To clean up and start fresh:

```bash
docker compose down -v
docker compose up --build
```

This removes all containers and the database volume, giving you a completely clean slate.

---

## Local development (without Docker Compose)

If you want to run locally (outside Docker Compose), you need a MySQL database.

### Start MySQL (DB only)

```bash
docker run -d --name training-db \
  -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=training_center \
  mysql:8.0
```

### Run Spring Boot

```bash
cd trainingcenter
./mvnw spring-boot:run
```

By default it runs on http://localhost:8080 (unless you changed `server.port`).

## REST + Web together

Both are served by the same Spring Boot app:

- `trainingcenter/src/main/java/com/iit/trainingcenter/web` → Thymeleaf pages
- `trainingcenter/src/main/java/com/iit/trainingcenter/restcontroller` → REST JSON endpoints

Example:

- Web: `GET /students`
- REST: `GET /api/students`

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
| **Thymeleaf**       | 3.x     | Web UI templating                  |
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

On Linux/macOS, to check a port:

```bash
ss -lntp | grep 3307
```

Or use different port in `application.yml`:

```yaml
datasource:
  url: jdbc:mysql://localhost:3308/training_center
```

### Build Failures

**Error:** `Compilation failure`

**Solution:**

```bash
cd trainingcenter
./mvnw clean package
```

### phpMyAdmin Connection Issues

If you’re using Docker Compose, phpMyAdmin connects via the service name `db`.
If you rename the DB service, update `PMA_HOST` in `docker-compose.yml`.
