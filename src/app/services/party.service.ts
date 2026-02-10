import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Party } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class PartyService {
  private readonly API_URL = 'http://localhost:8080/api/admin/parties';

  constructor(private http: HttpClient) {}

  getAllParties(): Observable<Party[]> {
    return this.http.get<Party[]>(this.API_URL);
  }

  getPartyById(id: number): Observable<Party> {
    return this.http.get<Party>(`${this.API_URL}/${id}`);
  }

  createParty(party: Party): Observable<Party> {
    return this.http.post<Party>(this.API_URL, party);
  }

  updateParty(id: number, party: Party): Observable<Party> {
    return this.http.put<Party>(`${this.API_URL}/${id}`, party);
  }

  deleteParty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}



