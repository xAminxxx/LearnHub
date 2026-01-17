import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../services';
import { Course } from '../../models';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses = signal<Course[]>([]);
  searchTerm = signal<string>('');
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');

  filteredCourses = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.courses();
    return this.courses().filter(c => 
      c.title.toLowerCase().includes(term) || 
      c.code.toLowerCase().includes(term) ||
      (c.trainer?.firstName + ' ' + c.trainer?.lastName).toLowerCase().includes(term) ||
      c.specialization?.name.toLowerCase().includes(term)
    );
  });

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading.set(true);
    this.courseService.getAll().subscribe({
      next: (data: Course[]) => {
        this.courses.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.errorMessage.set('Failed to load courses. Error: ' + (err.message || 'Unknown error'));
        this.loading.set(false);
      }
    });
  }

  deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.delete(id).subscribe({
        next: () => {
          this.loadCourses();
        },
        error: (err: any) => {
          alert('Failed to delete course: ' + err.message);
        }
      });
    }
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  editCourse(course: Course): void {
    console.log('Edit course:', course);
  }
}
