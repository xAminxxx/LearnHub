# Architecture Diagram - LearnHub Training Center

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        APIClient[API Client/Mobile]
    end
    
    subgraph "Presentation Layer"
        WebUI[Thymeleaf Templates<br/>Bootstrap UI]
        RestAPI[REST API<br/>@RestController]
    end
    
    subgraph "Security Layer"
        JWTFilter[JWT Request Filter]
        SecurityConfig[Spring Security Config]
        AuthController[Auth REST Controller]
    end
    
    subgraph "Controller Layer"
        AdminControllers[Admin Controllers<br/>Students, Trainers, Courses, etc.]
        PublicControllers[Public Controllers<br/>Student, Trainer Views]
        RestControllers[REST Controllers<br/>API Endpoints]
    end
    
    subgraph "Service Layer"
        UserService[User Service]
        StudentService[Student Service]
        TrainerService[Trainer Service]
        CourseService[Course Service]
        EnrollmentService[Enrollment Service]
        SpecService[Specialization Service]
    end
    
    subgraph "Data Access Layer"
        UserRepo[User Repository]
        StudentRepo[Student Repository]
        TrainerRepo[Trainer Repository]
        CourseRepo[Course Repository]
        EnrollmentRepo[Enrollment Repository]
        SpecRepo[Specialization Repository]
    end
    
    subgraph "Data Layer"
        MySQL[(MySQL Database<br/>training_center)]
    end
    
    subgraph "Cross-Cutting Concerns"
        DTOMapper[DTO Mapper]
        DataSeeder[Data Seeder]
        JWTUtil[JWT Utility]
        Validation[Bean Validation]
    end
    
    Browser --> WebUI
    APIClient --> RestAPI
    
    WebUI --> SecurityConfig
    RestAPI --> JWTFilter
    JWTFilter --> SecurityConfig
    SecurityConfig --> AuthController
    
    WebUI --> AdminControllers
    WebUI --> PublicControllers
    RestAPI --> RestControllers
    
    AdminControllers --> UserService
    AdminControllers --> StudentService
    AdminControllers --> TrainerService
    AdminControllers --> CourseService
    AdminControllers --> EnrollmentService
    AdminControllers --> SpecService
    
    PublicControllers --> StudentService
    PublicControllers --> TrainerService
    
    RestControllers --> DTOMapper
    RestControllers --> UserService
    RestControllers --> StudentService
    RestControllers --> TrainerService
    RestControllers --> CourseService
    RestControllers --> EnrollmentService
    RestControllers --> SpecService
    
    AuthController --> JWTUtil
    AuthController --> UserService
    
    UserService --> UserRepo
    StudentService --> StudentRepo
    TrainerService --> TrainerRepo
    TrainerService --> SpecRepo
    CourseService --> CourseRepo
    EnrollmentService --> EnrollmentRepo
    SpecService --> SpecRepo
    
    UserRepo --> MySQL
    StudentRepo --> MySQL
    TrainerRepo --> MySQL
    CourseRepo --> MySQL
    EnrollmentRepo --> MySQL
    SpecRepo --> MySQL
    
    DataSeeder --> UserRepo
    DataSeeder --> StudentRepo
    DataSeeder --> TrainerRepo
    DataSeeder --> CourseRepo
    DataSeeder --> EnrollmentRepo
    DataSeeder --> SpecRepo
    
    Validation -.-> AdminControllers
    Validation -.-> RestControllers
```

## Architecture Layers Description

### 1. **Client Layer**
- **Web Browser**: Accesses server-side rendered pages
- **API Client**: Consumes REST API (future mobile apps, SPAs)

### 2. **Presentation Layer**
- **Thymeleaf Templates**: Server-side rendering with Bootstrap 5
- **REST API**: JSON-based API with Swagger documentation

### 3. **Security Layer**
- **JWT Filter**: Intercepts requests to validate JWT tokens
- **Spring Security Config**: Currently disabled (permitAll) for development
- **Auth Controller**: Handles login/register with JWT generation

### 4. **Controller Layer**
- **Admin Controllers**: Full CRUD operations (SSR)
  - Students, Trainers, Courses, Enrollments, Specializations
- **Public Controllers**: Read-only views for students/trainers
- **REST Controllers**: API endpoints returning DTOs

### 5. **Service Layer**
Business logic implementation:
- Transaction management
- Data validation
- Business rule enforcement
- Entity-to-DTO conversion coordination

### 6. **Data Access Layer**
- Spring Data JPA repositories
- Custom queries with `@Query` and `@EntityGraph`
- Optimized lazy loading prevention

### 7. **Data Layer**
- MySQL 8.0 database
- Managed by Hibernate with `ddl-auto: update`
- Persistent storage with Docker volumes

### 8. **Cross-Cutting Concerns**
- **DTO Mapper**: Prevents lazy loading issues in JSON responses
- **Data Seeder**: Initializes database with sample data
- **JWT Util**: Token generation and validation
- **Bean Validation**: `@Valid` annotations on entities/DTOs

## Technology Stack

**Backend:**
- Spring Boot 3.4.12
- Spring Data JPA (Hibernate 6.6.36)
- Spring Security 6.4
- Spring Validation

**Database:**
- MySQL 8.0
- HikariCP connection pool

**Security:**
- JWT (jjwt 0.11.5)
- BCrypt password encoding

**API Documentation:**
- SpringDoc OpenAPI 2.5.0 (Swagger)

**Frontend:**
- Thymeleaf template engine
- Bootstrap 5.3.3
- Minimal custom CSS

**DevOps:**
- Docker & Docker Compose
- Maven build tool
- Spring Boot DevTools
