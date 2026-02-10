import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ElectionService } from '../../../services/election.service';
import { PartyService } from '../../../services/party.service';
import { CandidateService } from '../../../services/candidate.service';
import { VoterService } from '../../../services/voter.service';
import { Election, Party, Candidate, Voter } from '../../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  elections = signal<Election[]>([]);
  parties = signal<Party[]>([]);
  candidates = signal<Candidate[]>([]);
  voters = signal<Voter[]>([]);

  constructor(
    private electionService: ElectionService,
    private partyService: PartyService,
    private candidateService: CandidateService,
    private voterService: VoterService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.electionService.getAllElections().subscribe({
      next: (data) => this.elections.set(data),
      error: () => {}
    });

    this.partyService.getAllParties().subscribe({
      next: (data) => this.parties.set(data),
      error: () => {}
    });

    this.candidateService.getAllCandidates().subscribe({
      next: (data) => this.candidates.set(data),
      error: () => {}
    });

    this.voterService.getAllVoters().subscribe({
      next: (data) => this.voters.set(data),
      error: () => {}
    });
  }

  getElectionsByStatus(status: string): Election[] {
    return this.elections().filter(e => e.status === status);
  }

  getStatusClass(status?: string): string {
    switch (status) {
      case 'ONGOING': return 'badge-warning';
      case 'COMPLETED': return 'badge-success';
      default: return 'badge-info';
    }
  }
}
