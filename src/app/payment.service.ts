import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = 'https://events.indiajoy.in/api';

  constructor(private http: HttpClient) {}

  createOrder(bookingIds: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-order`, { booking_ids: bookingIds });
  }

  updatePayment(paymentId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/fetch-payment`, { payment_id: paymentId });
  }
}
