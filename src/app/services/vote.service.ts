import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Election, Candidate, Vote, ElectionResult } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private readonly VOTER_API = 'http://localhost:8080/api/voter';
  private readonly ADMIN_API = 'http://localhost:8080/api/admin/results';

  constructor(private http: HttpClient) {}

  // Voter endpoints
  getOngoingElections(): Observable<Election[]> {
    return this.http.get<Election[]>(`${this.VOTER_API}/elections`);
  }

  getCandidatesForElection(electionId: number): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.VOTER_API}/elections/${electionId}/candidates`);
  }

  castVote(vote: Vote): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.VOTER_API}/vote`, vote);
  }

  hasVoted(electionId: number): Observable<{ hasVoted: boolean }> {
    return this.http.get<{ hasVoted: boolean }>(`${this.VOTER_API}/elections/${electionId}/has-voted`);
  }

  getVoterResults(electionId: number): Observable<ElectionResult> {
    return this.http.get<ElectionResult>(`${this.VOTER_API}/results/${electionId}`);
  }

  // Admin endpoints
  getElectionResults(electionId: number): Observable<ElectionResult> {
    return this.http.get<ElectionResult>(`${this.ADMIN_API}/election/${electionId}`);
  }

  getOngoingElectionResults(): Observable<ElectionResult[]> {
    return this.http.get<ElectionResult[]>(`${this.ADMIN_API}/ongoing`);
  }
}



