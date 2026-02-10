import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Voter } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class VoterService {
  private readonly API_URL = 'http://localhost:8080/api/admin/voters';

  constructor(private http: HttpClient) {}

  getAllVoters(): Observable<Voter[]> {
    return this.http.get<Voter[]>(this.API_URL);
  }

  getVoterById(id: number): Observable<Voter> {
    return this.http.get<Voter>(`${this.API_URL}/${id}`);
  }

  createVoter(voter: Voter): Observable<Voter> {
    return this.http.post<Voter>(this.API_URL, voter);
  }

  updateVoter(id: number, voter: Voter): Observable<Voter> {
    return this.http.put<Voter>(`${this.API_URL}/${id}`, voter);
  }

  deleteVoter(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}



