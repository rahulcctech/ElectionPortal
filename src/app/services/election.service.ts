import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Election } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ElectionService {
  private readonly API_URL = 'http://localhost:8080/api/admin/elections';

  constructor(private http: HttpClient) {}

  getAllElections(): Observable<Election[]> {
    return this.http.get<Election[]>(this.API_URL);
  }

  getElectionById(id: number): Observable<Election> {
    return this.http.get<Election>(`${this.API_URL}/${id}`);
  }

  getElectionsByStatus(status: string): Observable<Election[]> {
    return this.http.get<Election[]>(`${this.API_URL}/status/${status}`);
  }

  createElection(election: Election): Observable<Election> {
    return this.http.post<Election>(this.API_URL, election);
  }

  updateElection(id: number, election: Election): Observable<Election> {
    return this.http.put<Election>(`${this.API_URL}/${id}`, election);
  }

  deleteElection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  updateElectionStatus(id: number, status: string): Observable<Election> {
    return this.http.patch<Election>(`${this.API_URL}/${id}/status`, { status });
  }
}



