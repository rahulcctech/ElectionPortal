import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private readonly API_URL = 'http://localhost:8080/api/admin/candidates';

  constructor(private http: HttpClient) {}

  getAllCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.API_URL);
  }

  getCandidateById(id: number): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.API_URL}/${id}`);
  }

  getCandidatesByElection(electionId: number): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.API_URL}/election/${electionId}`);
  }

  createCandidate(candidate: Candidate): Observable<Candidate> {
    return this.http.post<Candidate>(this.API_URL, candidate);
  }

  updateCandidate(id: number, candidate: Candidate): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.API_URL}/${id}`, candidate);
  }

  deleteCandidate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}



