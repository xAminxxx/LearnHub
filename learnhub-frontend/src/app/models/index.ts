export interface Specialization {
  id: number;
  name: string;
  description?: string;
  courseCount: number;
  studentCount: number;
  trainerCount: number;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  enrollmentDate: string;
  specialization?: Specialization;
}

export interface Trainer {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  hireDate: string;
  bio: string;
  specialization?: Specialization;
}

export interface Course {
  id: number;
  code: string;
  title: string;
  description: string;
  credit: number;
  maxStudents: number;
  enrolledStudentsCount: number;
  trainer?: Trainer;
  specialization?: Specialization;
}

export interface Enrollment {
  id: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseCode: string;
  student?: Student;
  course?: Course;
  enrollmentDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  score?: number;
  gradeType?: string;
}
