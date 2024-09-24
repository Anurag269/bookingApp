import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments.prod';

@Injectable({
  providedIn: 'root',
})
export class DataserviceService {

  constructor(private http: HttpClient) { }

  getSeatsData(): Observable<any> {
    return this.http.get<any>(environment.boothUiDetailes, {
      withCredentials: true
    });
  }

  postBoothDetails(formData: any): Observable<any> {
    return this.http.post<any>(environment.boothpostDetailes, formData, {
      withCredentials: true
    });
  }
  getSummeryData(): Observable<any> {
    return this.http.get<any>(environment.summeryDetailes, {
      withCredentials: true
    });
  }
  userLogin(formData: any): Observable<any> {
    return this.http.post<any>(environment.login, formData, {
      withCredentials: true
    });
  }
  userLogout(): Observable<any> {
    return this.http.get<any>(environment.logout, {
      withCredentials: true
    });
  }
  blockBooth(formData: any): Observable<any> {
    return this.http.post<any>(environment.block_booth, formData, {
      withCredentials: true
    });
  }
  downloadBoothDetails(): Observable<Blob> {
    return this.http.get<Blob>(environment.downloadBoothDetails, {
      withCredentials: true,
      responseType: 'blob' as 'json'
    });
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
