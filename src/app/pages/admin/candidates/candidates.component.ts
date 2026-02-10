import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidateService } from '../../../services/candidate.service';
import { PartyService } from '../../../services/party.service';
import { ElectionService } from '../../../services/election.service';
import { Candidate, Party, Election } from '../../../models/models';

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candidates.component.html',
  styleUrl: './candidates.component.scss'
})
export class CandidatesComponent implements OnInit {
  candidates = signal<Candidate[]>([]);
  parties = signal<Party[]>([]);
  elections = signal<Election[]>([]);
  showModal = signal(false);
  editingCandidate = signal<Candidate | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');

  formData: Candidate = { name: '', partyId: 0, electionId: 0 };

  constructor(
    private candidateService: CandidateService,
    private partyService: PartyService,
    private electionService: ElectionService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.candidateService.getAllCandidates().subscribe({
      next: (data) => this.candidates.set(data),
      error: () => {}
    });

    this.partyService.getAllParties().subscribe({
      next: (data) => this.parties.set(data),
      error: () => {}
    });

    this.electionService.getAllElections().subscribe({
      next: (data) => this.elections.set(data),
      error: () => {}
    });
  }

  openModal(): void {
    this.editingCandidate.set(null);
    this.formData = { name: '', partyId: 0, electionId: 0 };
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingCandidate.set(null);
  }

  editCandidate(candidate: Candidate): void {
    this.editingCandidate.set(candidate);
    this.formData = { name: candidate.name, partyId: candidate.partyId, electionId: candidate.electionId };
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  saveCandidate(): void {
    if (!this.formData.name || !this.formData.partyId || !this.formData.electionId) {
      this.errorMessage.set('All fields are required');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const request = this.editingCandidate()
      ? this.candidateService.updateCandidate(this.editingCandidate()!.id!, this.formData)
      : this.candidateService.createCandidate(this.formData);

    request.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.closeModal();
        this.loadData();
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Failed to save candidate');
      }
    });
  }

  deleteCandidate(candidate: Candidate): void {
    if (confirm(`Are you sure you want to delete "${candidate.name}"?`)) {
      this.candidateService.deleteCandidate(candidate.id!).subscribe({
        next: () => this.loadData(),
        error: () => {}
      });
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
