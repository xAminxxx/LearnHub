import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../services';
import { Student } from '../../models';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students = signal<Student[]>([]);
  searchTerm = signal<string>('');
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');

  filteredStudents = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.students();
    return this.students().filter(s => 
      s.firstName.toLowerCase().includes(term) || 
      s.lastName.toLowerCase().includes(term) || 
      s.email.toLowerCase().includes(term) ||
      s.id.toString().includes(term)
    );
  });

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading.set(true);
    this.studentService.getAll().subscribe({
      next: (data: Student[]) => {
        this.students.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.errorMessage.set('Failed to load students. Error: ' + (err.message || 'Unknown error'));
        this.loading.set(false);
      }
    });
  }

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.delete(id).subscribe({
        next: () => {
          this.loadStudents();
        },
        error: (err: any) => {
          alert('Failed to delete student: ' + err.message);
        }
      });
    }
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  editStudent(student: Student): void {
    console.log('Edit student:', student);
    // TODO: Implement edit logic (modal or navigation)
  }
}
