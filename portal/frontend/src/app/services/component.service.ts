import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComponentSubmission, SubmissionResponse } from '../models/component.model';

@Injectable({ providedIn: 'root' })
export class ComponentService {
  private apiUrl = '/api/components';

  constructor(private http: HttpClient) {}

  submit(component: ComponentSubmission): Observable<SubmissionResponse> {
    return this.http.post<SubmissionResponse>(this.apiUrl, component);
  }

  validate(component: Partial<ComponentSubmission>): Observable<{ valid: boolean; errors: string[] }> {
    return this.http.post<{ valid: boolean; errors: string[] }>(`${this.apiUrl}/validate`, component);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  checkNameAvailability(name: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.apiUrl}/check-name/${name}`);
  }
}
