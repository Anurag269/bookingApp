import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataserviceService {

  // private jsonUrl = 'assets/json/dev.json'; // Replace this with your actual URL
  private jsonUrl  ='https://events.indiajoy.in/api/booth-details'
  private apiUrl ='https://events.indiajoy.in/booth-details';
  constructor(private http: HttpClient) { }

  getSeatsData(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }

  postBoothDetails(formData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
  
}
