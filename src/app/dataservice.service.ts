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
  
}
