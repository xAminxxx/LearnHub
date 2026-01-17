import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SpecializationService } from '../../services';
import { Specialization } from '../../models';

@Component({
  selector: 'app-specialization-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './specialization-list.component.html',
  styleUrls: ['./specialization-list.component.css']
})
export class SpecializationListComponent implements OnInit {
  specializations = signal<Specialization[]>([]);
  searchTerm = signal<string>('');
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');

  filteredSpecializations = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.specializations();
    return this.specializations().filter(s => 
      s.name.toLowerCase().includes(term) || 
      (s.description?.toLowerCase() || '').includes(term)
    );
  });

  constructor(private specializationService: SpecializationService) { }

  ngOnInit(): void {
    this.loadSpecializations();
  }

  loadSpecializations(): void {
    this.loading.set(true);
    this.specializationService.getAll().subscribe({
      next: (data: Specialization[]) => {
        this.specializations.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.errorMessage.set('Failed to load specializations. Error: ' + (err.message || 'Unknown error'));
        this.loading.set(false);
      }
    });
  }

  deleteSpecialization(id: number): void {
    if (confirm('Are you sure you want to delete this specialization?')) {
      this.specializationService.delete(id).subscribe({
        next: () => {
          this.loadSpecializations();
        },
        error: (err: any) => {
          alert('Failed to delete specialization: ' + err.message);
        }
      });
    }
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  editSpecialization(spec: Specialization): void {
    console.log('Edit specialization:', spec);
  }
}
