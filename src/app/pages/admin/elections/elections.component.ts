import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElectionService } from '../../../services/election.service';
import { Election } from '../../../models/models';

@Component({
  selector: 'app-elections',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './elections.component.html',
  styleUrl: './elections.component.scss'
})
export class ElectionsComponent implements OnInit {
  elections = signal<Election[]>([]);
  showModal = signal(false);
  showStatusModal = signal(false);
  editingElection = signal<Election | null>(null);
  selectedElection = signal<Election | null>(null);
  selectedStatus = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  formData: Election = {
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    status: 'UPCOMING'
  };

  constructor(private electionService: ElectionService) {}

  ngOnInit(): void {
    this.loadElections();
  }

  loadElections(): void {
    this.electionService.getAllElections().subscribe({
      next: (data) => this.elections.set(data),
      error: () => {}
    });
  }

  openModal(): void {
    this.editingElection.set(null);
    this.formData = { name: '', description: '', startTime: '', endTime: '', status: 'UPCOMING' };
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingElection.set(null);
  }

  editElection(election: Election): void {
    this.editingElection.set(election);
    this.formData = {
      name: election.name,
      description: election.description || '',
      startTime: election.startTime ? this.formatDateTimeLocal(election.startTime) : '',
      endTime: election.endTime ? this.formatDateTimeLocal(election.endTime) : '',
      status: election.status || 'UPCOMING'
    };
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  saveElection(): void {
    if (!this.formData.name) {
      this.errorMessage.set('Election name is required');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const electionData: Election = {
      ...this.formData,
      startTime: this.formData.startTime ? new Date(this.formData.startTime).toISOString() : undefined,
      endTime: this.formData.endTime ? new Date(this.formData.endTime).toISOString() : undefined
    };

    const request = this.editingElection()
      ? this.electionService.updateElection(this.editingElection()!.id!, electionData)
      : this.electionService.createElection(electionData);

    request.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.closeModal();
        this.loadElections();
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Failed to save election');
      }
    });
  }

  deleteElection(election: Election): void {
    if (confirm(`Are you sure you want to delete "${election.name}"?`)) {
      this.electionService.deleteElection(election.id!).subscribe({
        next: () => this.loadElections(),
        error: () => {}
      });
    }
  }

  openStatusModal(election: Election): void {
    this.selectedElection.set(election);
    this.selectedStatus.set(election.status || 'UPCOMING');
    this.showStatusModal.set(true);
  }

  closeStatusModal(): void {
    this.showStatusModal.set(false);
    this.selectedElection.set(null);
  }

  selectStatus(status: string): void {
    this.selectedStatus.set(status);
  }

  updateStatus(): void {
    const election = this.selectedElection();
    if (!election) return;

    this.isLoading.set(true);
    this.electionService.updateElectionStatus(election.id!, this.selectedStatus()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.closeStatusModal();
        this.loadElections();
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  getStatusClass(status?: string): string {
    switch (status) {
      case 'ONGOING': return 'badge-warning';
      case 'COMPLETED': return 'badge-success';
      default: return 'badge-info';
    }
  }

  formatDate(date?: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleString();
  }

  formatDateTimeLocal(date: string): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  }
}
