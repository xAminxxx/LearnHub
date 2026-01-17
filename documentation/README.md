# LearnHub Training Center - Documentation

This folder contains comprehensive technical documentation for the LearnHub Training Center application.

## 📋 Documentation Index

### 1. [Use Case Diagram](01-use-case-diagram.md)
Visual representation of system actors and their interactions:
- Admin use cases (CRUD operations, dashboard)
- Trainer use cases (course management, grading)
- Student use cases (enrollment, viewing grades)
- Guest use cases (browsing, registration)

### 2. [Class Diagram](02-class-diagram.md)
Object-oriented design showing all entities and their relationships:
- Core entities: User, Specialization, Trainer, Student, Course, Enrollment
- Enumerations: Role, EnrollmentStatus
- Methods and properties for each class

### 3. [Sequence Diagrams](03-sequence-diagram.md)
Flow of interactions between system components:
- Student enrollment process
- JWT authentication flow
- Admin CRUD operations
- Grade assignment workflow

### 4. [Entity-Relationship Diagram](04-er-diagram.md)
Database schema and table relationships:
- All database tables with columns and types
- Foreign key relationships
- Unique constraints and indexes
- Database design decisions

### 5. [Architecture Diagram](05-architecture-diagram.md)
System architecture and component organization:
- Layered architecture (Presentation, Controller, Service, Repository)
- Security layer integration
- Cross-cutting concerns
- Technology stack details

### 6. [Deployment Diagram](06-deployment-diagram.md)
Infrastructure and deployment configuration:
- Docker container architecture
- Network topology
- Port mappings and health checks
- Volume management
- Environment configurations

### 7. [API Documentation](07-api-documentation.md)
Complete REST API reference:
- Authentication endpoints
- CRUD operations for all entities
- Request/response examples
- Error handling

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- Docker & Docker Compose
- MySQL 8.0 (via Docker)

### Running the Application

1. **Start Database:**
```bash
cd LearnHub
docker compose up db phpmyadmin -d
```

2. **Run Spring Boot:**
```bash
cd trainingcenter
mvn spring-boot:run
```

3. **Access Applications:**
- Main App: http://localhost:8081
- Admin Dashboard: http://localhost:8081/admin
- Swagger UI: http://localhost:8081/swagger-ui.html
- phpMyAdmin: http://localhost:8082

## 🏗️ Project Structure

```
LearnHub/
├── documentation2/          # This documentation folder
├── trainingcenter/          # Spring Boot application
│   ├── src/main/java/
│   │   └── com/iit/trainingcenter/
│   │       ├── config/      # Security, Web config
│   │       ├── dto/         # Data Transfer Objects
│   │       ├── entity/      # JPA Entities
│   │       ├── repository/  # Spring Data repositories
│   │       ├── service/     # Business logic
│   │       ├── restcontroller/ # REST API endpoints
│   │       ├── web/         # Web controllers (Thymeleaf)
│   │       └── util/        # Utilities (JWT, DataSeeder)
│   └── src/main/resources/
│       ├── application.yml
│       ├── templates/       # Thymeleaf HTML templates
│       └── static/          # CSS, JS files
├── docker-compose.yml
└── Dockerfile
```

## 🎯 Key Features

- ✅ User authentication with JWT
- ✅ Role-based access (Admin, Trainer, Student)
- ✅ CRUD operations for all entities
- ✅ Student enrollment management
- ✅ Course capacity tracking
- ✅ Grade management system
- ✅ Specialization-based organization
- ✅ RESTful API with Swagger docs
- ✅ Server-side rendered admin dashboard
- ✅ Docker containerization

## 📊 Default Credentials

**Admin:**
- Username: `admin`
- Password: `password`

**Trainer:**
- Username: `trainer`
- Password: `password`

**Student:**
- Username: `student`
- Password: `password`

## 🔧 Technology Stack

- **Backend:** Spring Boot 3.4.12, Java 17
- **Database:** MySQL 8.0
- **Security:** Spring Security, JWT
- **ORM:** Hibernate 6.6.36
- **UI:** Thymeleaf, Bootstrap 5.3.3
- **API Docs:** SpringDoc OpenAPI
- **Build:** Maven
- **Containers:** Docker, Docker Compose

## 📝 Notes

- Security is currently **disabled** for development (`permitAll()`)
- Sample data is auto-seeded on startup via `DataSeeder`
- Hibernate is set to `update` mode (auto-creates/updates schema)
- Entity field `Course.credit` maps to DB column `credits`
- Entity field `Course.name` maps to DB column `title`

## 🔗 Related Documentation

- Original documentation in `/documentation` folder
- REFACTORING_GUIDE.md - Code improvement history
- ARCHITECTURE.md - High-level architecture overview

---

**Last Updated:** January 1, 2026  
**Version:** 0.0.1-SNAPSHOT
