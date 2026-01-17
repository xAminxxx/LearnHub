import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Specialization } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpecializationService {
  private apiUrl = `${environment.apiUrl}/specializations`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Specialization[]> {
    return this.http.get<Specialization[]>(this.apiUrl);
  }

  getById(id: number): Observable<Specialization> {
    return this.http.get<Specialization>(`${this.apiUrl}/${id}`);
  }

  create(specialization: any): Observable<Specialization> {
    return this.http.post<Specialization>(this.apiUrl, specialization);
  }

  update(id: number, specialization: any): Observable<Specialization> {
    return this.http.put<Specialization>(`${this.apiUrl}/${id}`, specialization);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
