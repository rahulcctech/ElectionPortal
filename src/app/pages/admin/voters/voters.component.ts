import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoterService } from '../../../services/voter.service';
import { Voter } from '../../../models/models';

@Component({
  selector: 'app-voters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './voters.component.html',
  styleUrl: './voters.component.scss'
})
export class VotersComponent implements OnInit {
  voters = signal<Voter[]>([]);
  showModal = signal(false);
  editingVoter = signal<Voter | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');

  formData: Voter = { name: '', age: 18, email: '', password: '' };

  constructor(private voterService: VoterService) {}

  ngOnInit(): void {
    this.loadVoters();
  }

  loadVoters(): void {
    this.voterService.getAllVoters().subscribe({
      next: (data) => this.voters.set(data),
      error: () => {}
    });
  }

  openModal(): void {
    this.editingVoter.set(null);
    this.formData = { name: '', age: 18, email: '', password: '' };
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingVoter.set(null);
  }

  editVoter(voter: Voter): void {
    this.editingVoter.set(voter);
    this.formData = { name: voter.name, age: voter.age, email: voter.email, password: '' };
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  saveVoter(): void {
    if (!this.formData.name || !this.formData.email || !this.formData.age) {
      this.errorMessage.set('Please fill in all required fields');
      return;
    }

    if (this.formData.age < 18) {
      this.errorMessage.set('Voter must be at least 18 years old');
      return;
    }

    if (!this.editingVoter() && !this.formData.password) {
      this.errorMessage.set('Password is required');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const voterData = { ...this.formData };
    if (this.editingVoter() && !voterData.password) {
      delete voterData.password;
    }

    const request = this.editingVoter()
      ? this.voterService.updateVoter(this.editingVoter()!.id!, voterData)
      : this.voterService.createVoter(voterData);

    request.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.closeModal();
        this.loadVoters();
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Failed to save voter');
      }
    });
  }

  deleteVoter(voter: Voter): void {
    if (confirm(`Are you sure you want to delete "${voter.name}"?`)) {
      this.voterService.deleteVoter(voter.id!).subscribe({
        next: () => this.loadVoters(),
        error: () => {}
      });
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
