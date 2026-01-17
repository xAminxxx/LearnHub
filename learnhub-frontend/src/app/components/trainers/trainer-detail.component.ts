import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TrainerService } from '../../services';
import { Trainer } from '../../models';

@Component({
  selector: 'app-trainer-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trainer-detail.component.html'
})
export class TrainerDetailComponent implements OnInit {
  trainer = signal<Trainer | null>(null);
  loading = signal(true);
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private trainerService: TrainerService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTrainer(+id);
    }
  }

  loadTrainer(id: number): void {
    this.loading.set(true);
    this.trainerService.getById(id).subscribe({
      next: (data) => {
        this.trainer.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load trainer details.');
        this.loading.set(false);
      }
    });
  }
}
