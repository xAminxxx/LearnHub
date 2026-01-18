import { Routes } from '@angular/router';
import { StudentListComponent } from './components/students/student-list.component';
import { StudentFormComponent } from './components/students/student-form.component';
import { StudentDetailComponent } from './components/students/student-detail.component';
import { CourseListComponent } from './components/courses/course-list.component';
import { CourseFormComponent } from './components/courses/course-form.component';
import { CourseDetailComponent } from './components/courses/course-detail.component';
import { TrainerListComponent } from './components/trainers/trainer-list.component';
import { TrainerFormComponent } from './components/trainers/trainer-form.component';
import { TrainerDetailComponent } from './components/trainers/trainer-detail.component';
import { SpecializationListComponent } from './components/specializations/specialization-list.component';
import { SpecializationFormComponent } from './components/specializations/specialization-form.component';
import { EnrollmentListComponent } from './components/enrollments/enrollment-list.component';
import { EnrollmentFormComponent } from './components/enrollments/enrollment-form.component';
import { EnrollmentDetailComponent } from './components/enrollments/enrollment-detail.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { UnauthorizedComponent } from './components/auth/unauthorized.component';
import { authGuard, guestGuard } from './guards/auth.guard';

// Student Portal Components
import { StudentDashboardComponent } from './components/student-portal/student-dashboard.component';
import { CourseCatalogComponent } from './components/student-portal/course-catalog.component';
import { StudentCourseDetailComponent } from './components/student-portal/student-course-detail.component';
import { MyEnrollmentsComponent } from './components/student-portal/my-enrollments.component';

// Trainer Portal Components
import { TrainerDashboardComponent } from './components/trainer-portal/trainer-dashboard.component';
import { TrainerCoursesComponent } from './components/trainer-portal/trainer-courses.component';
import { TrainerCourseDetailComponent } from './components/trainer-portal/trainer-course-detail.component';
import { TrainerGradesComponent } from './components/trainer-portal/trainer-grades.component';
import { TrainerStudentsComponent } from './components/trainer-portal/trainer-students.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  
  // Auth routes (accessible only when NOT logged in)
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'unauthorized', component: UnauthorizedComponent },

  // Protected routes (require authentication)
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'students', component: StudentListComponent, canActivate: [authGuard] },
  { path: 'students/new', component: StudentFormComponent, canActivate: [authGuard] },
  { path: 'students/edit/:id', component: StudentFormComponent, canActivate: [authGuard] },
  { path: 'students/:id', component: StudentDetailComponent, canActivate: [authGuard] },
  { path: 'courses', component: CourseListComponent, canActivate: [authGuard] },
  { path: 'courses/new', component: CourseFormComponent, canActivate: [authGuard] },
  { path: 'courses/edit/:id', component: CourseFormComponent, canActivate: [authGuard] },
  { path: 'courses/:id', component: CourseDetailComponent, canActivate: [authGuard] },
  { path: 'trainers', component: TrainerListComponent, canActivate: [authGuard] },
  { path: 'trainers/new', component: TrainerFormComponent, canActivate: [authGuard] },
  { path: 'trainers/edit/:id', component: TrainerFormComponent, canActivate: [authGuard] },
  { path: 'trainers/:id', component: TrainerDetailComponent, canActivate: [authGuard] },
  { path: 'specializations', component: SpecializationListComponent, canActivate: [authGuard] },
  { path: 'specializations/new', component: SpecializationFormComponent, canActivate: [authGuard] },
  { path: 'specializations/edit/:id', component: SpecializationFormComponent, canActivate: [authGuard] },
  { path: 'enrollments', component: EnrollmentListComponent, canActivate: [authGuard] },
  { path: 'enrollments/new', component: EnrollmentFormComponent, canActivate: [authGuard] },
  { path: 'enrollments/edit/:id', component: EnrollmentFormComponent, canActivate: [authGuard] },
  { path: 'enrollments/:id', component: EnrollmentDetailComponent, canActivate: [authGuard] },

  // Student Portal Routes (for STUDENT users to browse and enroll in courses)
  { path: 'student/dashboard', component: StudentDashboardComponent, canActivate: [authGuard] },
  { path: 'student/courses', component: CourseCatalogComponent, canActivate: [authGuard] },
  { path: 'student/courses/:id', component: StudentCourseDetailComponent, canActivate: [authGuard] },
  { path: 'student/my-enrollments', component: MyEnrollmentsComponent, canActivate: [authGuard] },

  // Trainer Portal Routes (for TRAINER users to manage their courses and students)
  { path: 'trainer/dashboard', component: TrainerDashboardComponent, canActivate: [authGuard] },
  { path: 'trainer/courses', component: TrainerCoursesComponent, canActivate: [authGuard] },
  { path: 'trainer/courses/:id', component: TrainerCourseDetailComponent, canActivate: [authGuard] },
  { path: 'trainer/courses/:id/grades', component: TrainerGradesComponent, canActivate: [authGuard] },
  { path: 'trainer/students', component: TrainerStudentsComponent, canActivate: [authGuard] },

  // Wildcard route
  { path: '**', redirectTo: 'dashboard' }
];
