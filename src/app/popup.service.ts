import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private popupVisibilitySource = new Subject<string>();

  popupVisibility$ = this.popupVisibilitySource.asObservable();

  showPopup(seatBooth: string) {
    this.popupVisibilitySource.next(seatBooth);
  }
}
