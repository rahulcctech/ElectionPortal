import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteService } from '../../../services/vote.service';
import { Election, ElectionResult } from '../../../models/models';

@Component({
  selector: 'app-voter-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voter-results.component.html',
  styleUrl: './voter-results.component.scss'
})
export class VoterResultsComponent implements OnInit {
  elections = signal<Election[]>([]);
  selectedElection = signal<Election | null>(null);
  currentResult = signal<ElectionResult | null>(null);
  isLoading = signal(true);

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

  loadResults(election: Election): void {
    if (this.selectedElection()?.id === election.id) {
      this.selectedElection.set(null);
      this.currentResult.set(null);
      return;
    }

    this.selectedElection.set(election);
    this.voteService.getVoterResults(election.id!).subscribe({
      next: (data) => this.currentResult.set(data),
      error: () => this.currentResult.set(null)
    });
  }

  getWinner() {
    const result = this.currentResult();
    if (!result) return null;
    return result.candidateResults.find(c => c.isWinner);
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
