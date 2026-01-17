# Entity-Relationship Diagram - LearnHub Database

```mermaid
erDiagram
    users ||--o{ user_roles : has
    users {
        bigint id PK
        varchar username UK
        varchar password
        varchar email UK
        enum role
        bit enabled
    }
    
    specializations ||--o{ courses : offers
    specializations ||--o{ students : has
    specializations ||--o{ trainers : employs
    specializations {
        bigint id PK
        varchar name UK
        varchar description
    }
    
    trainers ||--o{ courses : teaches
    trainers }o--|| specializations : belongs_to
    trainers {
        bigint id PK
        varchar first_name
        varchar last_name
        varchar email UK
        varchar phone
        date hire_date
        varchar bio
        bigint specialization_id FK
    }
    
    students }o--|| specializations : enrolled_in
    students ||--o{ enrollments : has
    students {
        bigint id PK
        varchar first_name
        varchar last_name
        varchar email UK
        varchar phone
        date birth_date
        date enrollment_date
        bigint specialization_id FK
    }
    
    courses }o--|| trainers : taught_by
    courses }o--|| specializations : belongs_to
    courses ||--o{ enrollments : has
    courses {
        bigint id PK
        varchar code UK
        varchar title
        varchar description
        int credit
        int max_students
        bigint trainer_id FK
        bigint specialization_id FK
    }
    
    enrollments }o--|| students : for
    enrollments }o--|| courses : in
    enrollments {
        bigint id PK
        bigint student_id FK
        bigint course_id FK
        enum status
        datetime enrollment_date
        datetime completion_date
        varchar notes
        float score
        varchar grade_type
    }
```

## Database Schema Details

### Tables Overview

#### users
- Primary authentication table
- Stores credentials and role information
- `role` enum: ADMIN, TRAINER, STUDENT
- `enabled` flag for account activation

#### specializations
- Academic departments or majors
- Central entity linking students, trainers, and courses
- Examples: Computer Science, Business

#### trainers
- Instructor information
- Linked to specialization
- Can teach multiple courses

#### students
- Learner information
- Enrolled in one specialization
- Can take multiple courses via enrollments

#### courses
- Class/module information
- Has capacity limit (`max_students`)
- Belongs to one specialization
- Taught by one trainer
- `credit` field stores academic credits (singular)

#### enrollments
- Junction table with additional metadata
- Links students to courses
- Tracks enrollment lifecycle (ACTIVE → COMPLETED/CANCELLED)
- Stores grades and completion information

### Constraints

**Unique Constraints:**
- `users.username`
- `users.email`
- `trainers.email`
- `students.email`
- `courses.code`
- `specializations.name`

**Foreign Key Constraints:**
- `trainers.specialization_id` → `specializations.id`
- `students.specialization_id` → `specializations.id`
- `courses.trainer_id` → `trainers.id`
- `courses.specialization_id` → `specializations.id`
- `enrollments.student_id` → `students.id`
- `enrollments.course_id` → `courses.id`

### Indexes (Recommended)
- `idx_enrollments_student` on `enrollments.student_id`
- `idx_enrollments_course` on `enrollments.course_id`
- `idx_enrollments_status` on `enrollments.status`
- `idx_courses_trainer` on `courses.trainer_id`
- `idx_courses_specialization` on `courses.specialization_id`
