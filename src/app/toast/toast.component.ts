import { Component, OnInit } from '@angular/core';
import { ToastService } from '../toast.service';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  standalone: true,
  imports: [
    NgClass
  ],
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  toast: { message: string, type: string } | null = null;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toastState$.subscribe(toast => {
      this.toast = toast;
    });
  }
}
