# User Stories

## Epic 1: Student Management

### US-001: Register as New Student

**As an** administrator  
**I want to** register new students in the system  
**So that** they can access the training center services

**Acceptance Criteria:**

- Given I am logged in as an administrator
- When I navigate to the student registration form
- And I fill in: first name, last name, email, phone, specialization
- And I click "Register Student"
- Then a new student account is created
- And the student receives a welcome email with login credentials
- And the student appears in the student list

**Priority:** High  
**Story Points:** 5

---

### US-002: View My Student Profile

**As a** student  
**I want to** view my personal profile  
**So that** I can see my information and academic details

**Acceptance Criteria:**

- Given I am logged in as a student
- When I navigate to "My Profile"
- Then I see my personal information (name, email, phone, specialization)
- And I see my enrolled courses
- And I see my grades
- And I see my average grade

**Priority:** High  
**Story Points:** 3

---

### US-003: Update Student Information

**As an** administrator  
**I want to** update student information  
**So that** the records are accurate

**Acceptance Criteria:**

- Given I am logged in as an administrator
- When I select a student from the list
- And I update their information (email, phone, specialization)
- And I click "Save Changes"
- Then the student's information is updated
- And a confirmation message is displayed
- And the student receives an email notification

**Priority:** Medium  
**Story Points:** 3

---

### US-004: Delete Student Account

**As an** administrator  
**I want to** delete student accounts  
**So that** inactive students are removed from the system

**Acceptance Criteria:**

- Given I am logged in as an administrator
- When I select a student to delete
- And I confirm the deletion
- Then the student account is deactivated
- And all enrollments are marked as cancelled
- And the student can no longer log in

**Priority:** Medium  
**Story Points:** 5

---

## Epic 2: Trainer Management

### US-005: Register New Trainer

**As an** administrator  
**I want to** register new trainers  
**So that** they can teach courses

**Acceptance Criteria:**

- Given I am logged in as an administrator
- When I navigate to trainer registration
- And I fill in: first name, last name, email, phone, specialization, bio
- And I click "Register Trainer"
- Then a trainer account is created
- And the trainer receives login credentials
- And the trainer appears in the trainer list

**Priority:** High  
**Story Points:** 5

---

### US-006: View Trainer Profile

**As a** trainer  
**I want to** view my profile  
**So that** I can see my information and assigned courses

**Acceptance Criteria:**

- Given I am logged in as a trainer
- When I navigate to "My Profile"
- Then I see my personal information
- And I see my specialization and bio
- And I see all courses I'm teaching
- And I see the number of students in each course

**Priority:** High  
**Story Points:** 3

---

### US-007: Update Trainer Information

**As an** administrator  
**I want to** update trainer information  
**So that** trainer records are current

**Acceptance Criteria:**

- Given I am logged in as an administrator
- When I select a trainer
- And I update their information
- And I click "Save"
- Then the trainer's profile is updated
- And a confirmation is displayed

**Priority:** Medium  
**Story Points:** 3

---

## Epic 3: Course Management

### US-008: Create New Course

**As an** administrator  
**I want to** create new courses  
**So that** students can enroll in them

**Acceptance Criteria:**

- Given I am logged in as an administrator
- When I navigate to "Create Course"
- And I fill in: title, description, code, max students, specialization
- And I assign a trainer
- And I click "Create Course"
- Then the course is created
- And it appears in the course catalog
- And the assigned trainer is notified

**Priority:** High  
**Story Points:** 5

---

### US-009: View Course Catalog

**As a** student  
**I want to** view all available courses  
**So that** I can choose courses to enroll in

**Acceptance Criteria:**

- Given I am logged in as a student
- When I navigate to "Courses"
- Then I see a list of all courses
- And I can filter by specialization
- And I can search by title or code
- And I see course details (title, description, trainer, available seats)
- And I see if I'm already enrolled

**Priority:** High  
**Story Points:** 5

---

### US-010: Update Course Information

**As an** administrator  
**I want to** update course information  
**So that** course details are accurate

**Acceptance Criteria:**

- Given I am logged in as an administrator
- When I select a course
- And I update its information
- And I click "Save"
- Then the course is updated
- And enrolled students are notified if major changes occur

**Priority:** Medium  
**Story Points:** 3

---

### US-011: Delete Course

**As an** administrator  
**I want to** delete courses  
**So that** cancelled courses are removed

**Acceptance Criteria:**

- Given I am logged in as an administrator
- When I select a course to delete
- And I confirm deletion
- Then the course is marked as inactive
- And all enrolled students are notified
- And enrollments are cancelled

**Priority:** Medium  
**Story Points:** 5

---

## Epic 4: Enrollment Management

### US-012: Enroll in Course

**As a** student  
**I want to** enroll in courses  
**So that** I can attend classes and learn

**Acceptance Criteria:**

- Given I am logged in as a student
- And I am viewing an available course
- When I click "Enroll"
- Then the system checks if the course is not full
- And the system checks for schedule conflicts
- And if all validations pass, I am enrolled
- And I receive a confirmation email
- And the trainer is notified
- And the course appears in "My Courses"

**Priority:** Critical  
**Story Points:** 8

---

### US-013: View My Enrollments

**As a** student  
**I want to** view all my enrollments  
**So that** I can see which courses I'm taking

**Acceptance Criteria:**

- Given I am logged in as a student
- When I navigate to "My Enrollments"
- Then I see all courses I'm enrolled in
- And I see enrollment date and status
- And I see course schedules
- And I see my grades (if available)

**Priority:** High  
**Story Points:** 3

---

### US-014: Cancel Enrollment

**As a** student  
**I want to** cancel my enrollment  
**So that** I can drop courses I don't want

**Acceptance Criteria:**

- Given I am logged in as a student
- And I am enrolled in a course
- When I click "Cancel Enrollment"
- And I confirm the cancellation
- Then my enrollment is marked as cancelled
- And I receive a cancellation confirmation email
- And the trainer is notified
- And my seat becomes available

**Priority:** Medium  
**Story Points:** 5

---

### US-015: View Course Enrollments (Trainer)

**As a** trainer  
**I want to** view all students enrolled in my courses  
**So that** I know who is attending

**Acceptance Criteria:**

- Given I am logged in as a trainer
- When I select one of my courses
- Then I see a list of all enrolled students
- And I see student names, emails, enrollment dates
- And I can export the list to PDF
- And I see the total number of students

**Priority:** High  
**Story Points:** 5

---

### US-016: Manage Enrollments (Admin)

**As an** administrator  
**I want to** manually enroll or remove students  
**So that** I can manage special cases

**Acceptance Criteria:**

- Given I am logged in as an administrator
- When I navigate to enrollment management
- Then I can manually enroll a student in any course
- And I can override capacity limits
- And I can cancel any enrollment
- And affected parties are notified

**Priority:** Medium  
**Story Points:** 5

---

## Epic 5: Grade Management

### US-017: Enter Grades

**As a** trainer  
**I want to** enter grades for my students  
**So that** their performance is recorded

**Acceptance Criteria:**

- Given I am logged in as a trainer
- And I have students enrolled in my course
- When I navigate to "Enter Grades"
- And I select a student
- And I enter: grade value (0-20), grade type (exam, quiz, project), date
- And I click "Submit Grade"
- Then the grade is saved
- And the student is notified by email
- And the grade appears in the student's profile

**Priority:** Critical  
**Story Points:** 8

---

### US-018: View My Grades

**As a** student  
**I want to** view all my grades  
**So that** I can track my academic performance

**Acceptance Criteria:**

- Given I am logged in as a student
- When I navigate to "My Grades"
- Then I see all grades grouped by course
- And I see grade value, type, date, and trainer comments
- And I see my average grade per course
- And I see my overall average
- And I can filter by course or grade type

**Priority:** High  
**Story Points:** 5

---

### US-019: Update Grades

**As a** trainer  
**I want to** update grades I've entered  
**So that** I can correct mistakes

**Acceptance Criteria:**

- Given I am logged in as a trainer
- And I have entered a grade
- When I select the grade to edit
- And I update the grade value or comments
- And I click "Update"
- Then the grade is updated
- And the student is notified of the change

**Priority:** Medium  
**Story Points:** 3

---

### US-020: Delete Grades

**As a** trainer  
**I want to** delete grades  
**So that** incorrect entries can be removed

**Acceptance Criteria:**

- Given I am logged in as a trainer
- When I select a grade
- And I click "Delete"
- And I confirm the deletion
- Then the grade is removed
- And the student is notified

**Priority:** Low  
**Story Points:** 3

---

### US-021: View Grade Statistics

**As a** trainer  
**I want to** view grade statistics for my courses  
**So that** I can analyze student performance

**Acceptance Criteria:**

- Given I am logged in as a trainer
- When I navigate to "Grade Statistics"
- Then I see average grades per course
- And I see the distribution of grades (histogram)
- And I see pass/fail rates
- And I can export statistics to PDF

**Priority:** Medium  
**Story Points:** 5

---

## Epic 6: Schedule Management

### US-022: Create Course Schedule

**As an** administrator  
**I want to** create schedules for courses  
**So that** students know when classes occur

**Acceptance Criteria:**

- Given I am logged in as an administrator
- When I navigate to "Create Schedule"
- And I select a course
- And I specify: day of week, start time, end time, room
- And I click "Create Schedule"
- Then the schedule is created
- And enrolled students are notified
- And the schedule appears in the course details

**Priority:** High  
**Story Points:** 8

---

### US-023: View My Schedule

**As a** student  
**I want to** view my weekly schedule  
**So that** I know when my classes are

**Acceptance Criteria:**

- Given I am logged in as a student
- When I navigate to "My Schedule"
- Then I see a calendar view of my weekly schedule
- And I see all my enrolled courses with times and rooms
- And I can switch between weeks
- And I can export my schedule to PDF

**Priority:** High  
**Story Points:** 5

---

### US-024: Detect Schedule Conflicts

**As a** student  
**I want to** be warned of schedule conflicts  
**So that** I don't enroll in overlapping courses

**Acceptance Criteria:**

- Given I am logged in as a student
- When I try to enroll in a course
- And the course schedule conflicts with my existing schedule
- Then I see an error message
- And I am shown the conflicting course
- And I cannot enroll until the conflict is resolved

**Priority:** Critical  
**Story Points:** 8

---

### US-025: Update Schedule

**As an** administrator  
**I want to** update course schedules  
**So that** changes can be communicated

**Acceptance Criteria:**

- Given I am logged in as an administrator
- When I select a schedule
- And I update the time or room
- And I click "Save"
- Then the schedule is updated
- And all enrolled students and trainers are notified

**Priority:** Medium  
**Story Points:** 5

---

## Epic 7: Session Management

### US-026: Record Session Attendance

**As a** trainer  
**I want to** record session attendance  
**So that** student attendance is tracked

**Acceptance Criteria:**

- Given I am logged in as a trainer
- And I have a scheduled session
- When I navigate to "Record Attendance"
- And I mark each student as present or absent
- And I click "Submit"
- Then attendance is recorded
- And absent students are notified

**Priority:** Medium  
**Story Points:** 5

---

### US-027: View Attendance Records

**As a** student  
**I want to** view my attendance  
**So that** I know my attendance rate

**Acceptance Criteria:**

- Given I am logged in as a student
- When I navigate to "My Attendance"
- Then I see my attendance for each course
- And I see the percentage of sessions attended
- And I see which sessions I missed

**Priority:** Medium  
**Story Points:** 3

---

## Epic 8: Reporting

### US-028: Generate Student Report

**As an** administrator  
**I want to** generate student reports  
**So that** I have documentation of student progress

**Acceptance Criteria:**

- Given I am logged in as an administrator
- When I select a student
- And I click "Generate Report"
- Then a PDF report is generated
- And it includes: student info, courses, grades, attendance
- And I can download the report

**Priority:** Medium  
**Story Points:** 8

---

### US-029: Generate Course Report

**As an** administrator  
**I want to** generate course reports  
**So that** I can analyze course performance

**Acceptance Criteria:**

- Given I am logged in as an administrator
- When I select a course
- And I click "Generate Report"
- Then a PDF report is generated
- And it includes: course info, enrolled students, grade statistics
- And I can download the report

**Priority:** Medium  
**Story Points:** 8

---

## Epic 9: Authentication & Authorization

### US-030: Login to System

**As a** user (student, trainer, admin)  
**I want to** log in with my credentials  
**So that** I can access the system

**Acceptance Criteria:**

- Given I am on the login page
- When I enter my email and password
- And I click "Login"
- Then the system validates my credentials
- And if valid, I am redirected to my dashboard
- And if invalid, I see an error message

**Priority:** Critical  
**Story Points:** 5

---

### US-031: Logout from System

**As a** user  
**I want to** log out  
**So that** my session is securely ended

**Acceptance Criteria:**

- Given I am logged in
- When I click "Logout"
- Then my session is terminated
- And I am redirected to the login page
- And I cannot access protected pages without logging in again

**Priority:** High  
**Story Points:** 2

---

### US-032: Role-Based Access Control

**As a** system  
**I want to** enforce role-based access  
**So that** users can only access authorized features

**Acceptance Criteria:**

- Given a user is logged in
- Then students can only access student features
- And trainers can only access trainer features
- And administrators can access all features
- And unauthorized access attempts are blocked

**Priority:** Critical  
**Story Points:** 8

---

## Epic 10: Notifications

### US-033: Receive Email Notifications

**As a** user  
**I want to** receive email notifications  
**So that** I stay informed of important events

**Acceptance Criteria:**

- Given an important event occurs (enrollment, grade entry, schedule change)
- Then affected users receive an email notification
- And the email contains relevant details
- And the email includes a link to the system

**Priority:** Medium  
**Story Points:** 5

---

### US-034: View In-App Notifications

**As a** user  
**I want to** view notifications within the application  
**So that** I don't miss important updates

**Acceptance Criteria:**

- Given I am logged in
- When I click the notification icon
- Then I see all my unread notifications
- And I can mark notifications as read
- And I can navigate to related pages

**Priority:** Low  
**Story Points:** 5

---

## Summary

| Epic                           | Total Stories | Total Story Points | Priority |
| ------------------------------ | ------------- | ------------------ | -------- |
| Student Management             | 4             | 16                 | High     |
| Trainer Management             | 3             | 11                 | High     |
| Course Management              | 4             | 18                 | High     |
| Enrollment Management          | 5             | 26                 | Critical |
| Grade Management               | 5             | 24                 | Critical |
| Schedule Management            | 4             | 26                 | Critical |
| Session Management             | 2             | 8                  | Medium   |
| Reporting                      | 2             | 16                 | Medium   |
| Authentication & Authorization | 3             | 15                 | Critical |
| Notifications                  | 2             | 10                 | Medium   |
| **Total**                      | **34**        | **170**            | -        |

---

## Story Point Scale

- **1-2 points**: Trivial task, < 2 hours
- **3 points**: Small task, 2-4 hours
- **5 points**: Medium task, 1 day
- **8 points**: Large task, 2-3 days
- **13 points**: Very large, needs breakdown

---

## Priority Definitions

- **Critical**: Must have for MVP, core functionality
- **High**: Important for user experience
- **Medium**: Nice to have, can be deferred
- **Low**: Future enhancement
