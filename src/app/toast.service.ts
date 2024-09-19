import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new BehaviorSubject<{ message: string, type: string } | null>(null);
  toastState$ = this.toastSubject.asObservable();

  showToast(message: string, type: 'success' | 'warning', duration: number = 3000) {
    this.toastSubject.next({ message, type });
    setTimeout(() => {
      this.toastSubject.next(null);
    }, duration);
  }
}
