import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReloadService {

  constructor() { }
  private reloadSubject = new BehaviorSubject<void>(undefined);
  reload$ = this.reloadSubject.asObservable();

  triggerReload() {
    this.reloadSubject.next(); // Emit the reload event
  }
}
