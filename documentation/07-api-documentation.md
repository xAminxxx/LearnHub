# API Documentation - LearnHub Training Center

## Base URL
```
http://localhost:8081
```

## Swagger UI
```
http://localhost:8081/swagger-ui.html
```

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securePassword123",
  "email": "john@example.com"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "STUDENT",
  "enabled": true
}
```

---

### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzUxMiJ9..."
}
```

**Error Response:** `401 Unauthorized`
```json
{
  "timestamp": "2026-01-01T12:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid username or password"
}
```

---

## Student Endpoints

### GET /api/students
Get all students.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "firstName": "Alice",
    "lastName": "Smith",
    "email": "alice.smith@example.com",
    "phone": "33333333",
    "birthDate": "2006-01-01",
    "enrollmentDate": "2026-01-01",
    "specialization": {
      "id": 1,
      "name": "Computer Science",
      "description": "Computer Science description"
    }
  }
]
```

---

### GET /api/students/{id}
Get student by ID.

**Response:** `200 OK`
```json
{
  "id": 1,
  "firstName": "Alice",
  "lastName": "Smith",
  "email": "alice.smith@example.com",
  "phone": "33333333",
  "birthDate": "2006-01-01",
  "enrollmentDate": "2026-01-01",
  "specialization": {
    "id": 1,
    "name": "Computer Science",
    "description": "Computer Science description"
  }
}
```

---

### POST /api/students
Create a new student.

**Request Body:**
```json
{
  "firstName": "Bob",
  "lastName": "Johnson",
  "email": "bob@example.com",
  "phone": "44444444",
  "birthDate": "2004-05-15",
  "enrollmentDate": "2026-01-01",
  "specialization": {
    "id": 1
  }
}
```

**Response:** `200 OK` - Returns created StudentDto

---

### PUT /api/students/{id}
Update existing student.

**Request Body:** Same as POST

**Response:** `200 OK` - Returns updated StudentDto

---

### DELETE /api/students/{id}
Delete student by ID.

**Response:** `204 No Content`

---

## Trainer Endpoints

### GET /api/trainers
Get all trainers.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "11111111",
    "hireDate": "2026-01-01",
    "bio": "Bio for John Doe",
    "specialization": {
      "id": 1,
      "name": "Computer Science",
      "description": "Computer Science description"
    }
  }
]
```

---

### GET /api/trainers/{id}
Get trainer by ID.

**Response:** `200 OK` - Returns TrainerDto

---

### POST /api/trainers
Create a new trainer.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "22222222",
  "hireDate": "2026-01-01",
  "bio": "Experienced instructor",
  "specializationId": 1
}
```

**Response:** `200 OK` - Returns created TrainerDto

---

### PUT /api/trainers/{id}
Update existing trainer.

**Request Body:** Same as POST (TrainerUpsertRequest)

**Response:** `200 OK` - Returns updated TrainerDto

---

### DELETE /api/trainers/{id}
Delete trainer by ID.

**Response:** `204 No Content`

---

## Course Endpoints

### GET /api/courses
Get all courses.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "code": "CS101",
    "title": "Intro to CS",
    "description": "Intro to CS description",
    "credit": 3,
    "maxStudents": 30,
    "trainer": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "11111111",
      "hireDate": "2026-01-01",
      "bio": "Bio for John Doe",
      "specialization": {
        "id": 1,
        "name": "Computer Science",
        "description": "Computer Science description"
      }
    },
    "specialization": {
      "id": 1,
      "name": "Computer Science",
      "description": "Computer Science description"
    }
  }
]
```

---

### GET /api/courses/{id}
Get course by ID.

**Response:** `200 OK` - Returns CourseDto

---

### POST /api/courses
Create a new course.

**Request Body:**
```json
{
  "code": "CS201",
  "name": "Data Structures",
  "description": "Advanced data structures",
  "credit": 4,
  "maxStudents": 25,
  "trainer": {
    "id": 1
  },
  "specialization": {
    "id": 1
  }
}
```

**Response:** `200 OK` - Returns created Course

---

### PUT /api/courses/{id}
Update existing course.

**Request Body:** Same as POST

**Response:** `200 OK` - Returns updated Course

---

### DELETE /api/courses/{id}
Delete course by ID.

**Response:** `204 No Content`

---

## Enrollment Endpoints

### GET /api/enrollments
Get all enrollments.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "studentId": 1,
    "studentName": "Alice Smith",
    "courseId": 1,
    "courseCode": "CS101",
    "status": "ACTIVE",
    "enrollmentDate": "2026-01-01T12:00:00",
    "completionDate": null,
    "notes": null,
    "score": null,
    "gradeType": null
  }
]
```

---

### GET /api/enrollments/{id}
Get enrollment by ID.

**Response:** `200 OK` - Returns EnrollmentDto

---

### POST /api/enrollments
Create a new enrollment.

**Request Body:**
```json
{
  "student": {
    "id": 1
  },
  "course": {
    "id": 1
  },
  "status": "ACTIVE",
  "notes": "Regular enrollment"
}
```

**Response:** `200 OK` - Returns created Enrollment

---

### PUT /api/enrollments/{id}
Update existing enrollment.

**Request Body:**
```json
{
  "student": {
    "id": 1
  },
  "course": {
    "id": 1
  },
  "status": "COMPLETED",
  "score": 18.5,
  "gradeType": "EXAM",
  "notes": "Final grade"
}
```

**Response:** `200 OK` - Returns updated Enrollment

---

### DELETE /api/enrollments/{id}
Delete enrollment by ID.

**Response:** `204 No Content`

---

## Specialization Endpoints

### GET /api/specializations
Get all specializations.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Computer Science",
    "description": "Computer Science description"
  },
  {
    "id": 2,
    "name": "Business",
    "description": "Business description"
  }
]
```

---

### GET /api/specializations/{id}
Get specialization by ID.

**Response:** `200 OK` - Returns SpecializationDto

---

### POST /api/specializations
Create a new specialization.

**Request Body:**
```json
{
  "name": "Engineering",
  "description": "Engineering programs"
}
```

**Response:** `200 OK` - Returns created Specialization

---

### PUT /api/specializations/{id}
Update existing specialization.

**Request Body:** Same as POST

**Response:** `200 OK` - Returns updated Specialization

---

### DELETE /api/specializations/{id}
Delete specialization by ID.

**Response:** `204 No Content`

---

## Error Responses

### Common HTTP Status Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request (Validation Error) |
| 401 | Unauthorized (Invalid/Missing JWT) |
| 403 | Forbidden (Insufficient Permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

### Error Response Format
```json
{
  "timestamp": "2026-01-01T12:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/students"
}
```

---

## Authentication

All API endpoints (except `/api/auth/*`) require JWT authentication when security is enabled.

**Header:**
```
Authorization: Bearer <your-jwt-token>
```

**Note:** Security is currently disabled in development mode (`permitAll()`).
