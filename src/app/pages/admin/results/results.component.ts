import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoteService } from '../../../services/vote.service';
import { ElectionService } from '../../../services/election.service';
import { Election, ElectionResult } from '../../../models/models';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
  elections = signal<Election[]>([]);
  selectedResult = signal<ElectionResult | null>(null);
  selectedElectionId: number | null = null;

  constructor(
    private voteService: VoteService,
    private electionService: ElectionService
  ) {}

  ngOnInit(): void {
    this.electionService.getAllElections().subscribe({
      next: (data) => this.elections.set(data),
      error: () => {}
    });
  }

  loadResults(electionId: number | null): void {
    if (!electionId) {
      this.selectedResult.set(null);
      return;
    }

    this.voteService.getElectionResults(electionId).subscribe({
      next: (data) => this.selectedResult.set(data),
      error: () => this.selectedResult.set(null)
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}
