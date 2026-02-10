import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteService } from '../../../services/vote.service';
import { Election, Candidate } from '../../../models/models';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vote.component.html',
  styleUrl: './vote.component.scss'
})
export class VoteComponent implements OnInit {
  elections = signal<Election[]>([]);
  candidates = signal<Candidate[]>([]);
  selectedElection = signal<Election | null>(null);
  selectedCandidate = signal<Candidate | null>(null);
  hasVoted = signal(false);
  isLoading = signal(true);
  isVoting = signal(false);
  showSuccessModal = signal(false);

  constructor(private voteService: VoteService) {}

  ngOnInit(): void {
    this.loadElections();
  }

  loadElections(): void {
    this.isLoading.set(true);
    this.voteService.getOngoingElections().subscribe({
      next: (data) => {
        this.elections.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  selectElection(election: Election): void {
    if (this.selectedElection()?.id === election.id) {
      this.selectedElection.set(null);
      this.candidates.set([]);
      this.selectedCandidate.set(null);
      return;
    }

    this.selectedElection.set(election);
    this.selectedCandidate.set(null);
    
    // Check if already voted
    this.voteService.hasVoted(election.id!).subscribe({
      next: (response) => {
        this.hasVoted.set(response.hasVoted);
        if (!response.hasVoted) {
          this.loadCandidates(election.id!);
        }
      },
      error: () => this.hasVoted.set(false)
    });
  }

  loadCandidates(electionId: number): void {
    this.voteService.getCandidatesForElection(electionId).subscribe({
      next: (data) => this.candidates.set(data),
      error: () => {}
    });
  }

  selectCandidate(candidate: Candidate): void {
    this.selectedCandidate.set(candidate);
  }

  confirmVote(): void {
    const election = this.selectedElection();
    const candidate = this.selectedCandidate();
    
    if (!election || !candidate) return;

    if (!confirm(`Are you sure you want to vote for ${candidate.name}? This action cannot be undone.`)) {
      return;
    }

    this.isVoting.set(true);
    
    this.voteService.castVote({
      electionId: election.id!,
      candidateId: candidate.id!
    }).subscribe({
      next: () => {
        this.isVoting.set(false);
        this.hasVoted.set(true);
        this.showSuccessModal.set(true);
      },
      error: () => {
        this.isVoting.set(false);
      }
    });
  }

  closeSuccessModal(): void {
    this.showSuccessModal.set(false);
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
