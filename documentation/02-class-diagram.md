# Class Diagram - LearnHub Training Center

```mermaid
classDiagram
    class User {
        -Long id
        -String username
        -String password
        -String email
        -Role role
        -Boolean enabled
        +hasRole(Role) boolean
        +isActive() boolean
    }
    
    class Role {
        <<enumeration>>
        ADMIN
        TRAINER
        STUDENT
    }
    
    class Specialization {
        -Long id
        -String name
        -String description
        -List~Course~ courses
        -List~Student~ students
        -List~Trainer~ trainers
        +getCourseCount() int
        +getStudentCount() int
        +getTrainerCount() int
    }
    
    class Trainer {
        -Long id
        -String firstName
        -String lastName
        -String email
        -String phone
        -LocalDate hireDate
        -String bio
        -Specialization specialization
        -List~Course~ courses
        +getFullName() String
        +getCourseCount() int
        +getStudentCount() int
    }
    
    class Student {
        -Long id
        -String firstName
        -String lastName
        -String email
        -String phone
        -LocalDate birthDate
        -LocalDate enrollmentDate
        -Specialization specialization
        -List~Enrollment~ enrollments
        +getFullName() String
        +getEnrolledCourses() List~Course~
    }
    
    class Course {
        -Long id
        -String code
        -String name
        -String description
        -int credit
        -int maxStudents
        -Trainer trainer
        -Specialization specialization
        -List~Enrollment~ enrollments
        +getFullName() String
        +getEnrolledStudentsCount() int
        +isAvailable() boolean
    }
    
    class Enrollment {
        -Long id
        -Student student
        -Course course
        -EnrollmentStatus status
        -LocalDateTime enrollmentDate
        -LocalDateTime completionDate
        -String notes
        -Double score
        -String gradeType
        +isActive() boolean
        +isCompleted() boolean
        +isCancelled() boolean
        +cancel() void
        +complete() void
    }
    
    class EnrollmentStatus {
        <<enumeration>>
        ACTIVE
        CANCELLED
        COMPLETED
    }
    
    User "1" --> "1" Role
    Specialization "1" --> "*" Course
    Specialization "1" --> "*" Student
    Specialization "1" --> "*" Trainer
    Trainer "1" --> "*" Course
    Student "1" --> "*" Enrollment
    Course "1" --> "*" Enrollment
    Enrollment "1" --> "1" EnrollmentStatus
```

## Entity Relationships

### Core Entities
- **User**: Authentication entity with role-based access
- **Specialization**: Academic department/major
- **Trainer**: Instructors who teach courses
- **Student**: Learners enrolled in specializations
- **Course**: Classes with capacity limits
- **Enrollment**: Junction entity tracking student-course relationships with grades

### Key Relationships
- One Specialization has many Courses, Students, and Trainers
- One Trainer teaches many Courses
- One Course has many Enrollments
- One Student has many Enrollments
- Enrollment links Student and Course with additional metadata (status, grades)
