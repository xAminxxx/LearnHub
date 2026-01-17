import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../services';
import { Trainer } from '../../models';

@Component({
  selector: 'app-trainer-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trainer-list.component.html',
  styleUrls: ['./trainer-list.component.css']
})
export class TrainerListComponent implements OnInit {
  trainers = signal<Trainer[]>([]);
  searchTerm = signal<string>('');
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');

  filteredTrainers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.trainers();
    return this.trainers().filter(t => 
      t.firstName.toLowerCase().includes(term) || 
      t.lastName.toLowerCase().includes(term) || 
      t.email.toLowerCase().includes(term) ||
      t.specialization?.name.toLowerCase().includes(term)
    );
  });

  constructor(private trainerService: TrainerService) { }

  ngOnInit(): void {
    this.loadTrainers();
  }

  loadTrainers(): void {
    this.loading.set(true);
    this.trainerService.getAll().subscribe({
      next: (data: Trainer[]) => {
        this.trainers.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.errorMessage.set('Failed to load trainers. Error: ' + (err.message || 'Unknown error'));
        this.loading.set(false);
      }
    });
  }

  deleteTrainer(id: number): void {
    if (confirm('Are you sure you want to delete this trainer?')) {
      this.trainerService.delete(id).subscribe({
        next: () => {
          this.loadTrainers();
        },
        error: (err: any) => {
          alert('Failed to delete trainer: ' + err.message);
        }
      });
    }
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  editTrainer(trainer: Trainer): void {
    console.log('Edit trainer:', trainer);
  }
}
