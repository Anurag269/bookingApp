import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments.prod';

@Injectable({
  providedIn: 'root'
})
export class DataserviceService {

  constructor(private http: HttpClient) { }

  getSeatsData(): Observable<any> {
    return this.http.get<any>(environment.boothUiDetailes);
  }

  postBoothDetails(formData: any): Observable<any> {
    return this.http.post<any>(environment.boothpostDetailes, formData);
  }
  getSummeryData(): Observable<any> {
    return this.http.get<any>(environment.summeryDetailes);
  }
  userLogin(formData: any): Observable<any> {
    return this.http.post<any>(environment.login, formData);
  }
  userLogout(): Observable<any> {
    return this.http.get<any>(environment.logout);
  }
  blockBooth(formData: any): Observable<any> {
    return this.http.post<any>(environment.block_booth, formData);
  }
  downloadBoothDetails(): Observable<any> {
    return this.http.get<any>(environment.downloadBoothDetails);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Store session ID in localStorage or sessionStorage
  storeSessionId(): void {
    if (this.isBrowser()) {
      localStorage.setItem('sessionKey', 'loggedin');
    }
  }

  // Retrieve session ID
  getSessionId(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('sessionKey');
    }
    return null;
  }

  // Remove session ID
  clearSessionId(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('sessionKey');
    }
  }
}
