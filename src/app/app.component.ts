import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookingLayoutComponent } from './booking-layout/booking-layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DataserviceService } from './dataservice.service';
import { HttpClientModule } from '@angular/common/http';
import { ModelComponent } from './model/model.component';
import { PopupComponent } from './popup/popup.component';
import { PopupService } from './popup.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,BookingLayoutComponent, MatToolbarModule,
    MatIconModule, DragDropModule,HttpClientModule,ModelComponent,PopupComponent,MatIconModule],
    providers: [DataserviceService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'bookinglayout';
  zoomLevel: number = 0.5;
  isDragging: boolean = false;
  startX: number = 0;
  isHighlighted: boolean = false;
  startY: number = 0;
  offsetX: number = 0;
  offsetY: number = 0;
  BookingData: any;
  isPopupVisible = false;
  selectedSeatBooth!: string;
  zoomTimeout: any;
  private isInitialized = false;
  constructor(private popupService: PopupService) {}

  ngOnInit() {
    this.popupService.popupVisibility$.subscribe(seatBooth => {
      if (this.isInitialized) {
        this.selectedSeatBooth = seatBooth;
        this.isPopupVisible = true;
      }
    });

    // Mark the initialization as complete
    this.isInitialized = true;
  }

  get zoomTransform(): string {
    return `scale(${this.zoomLevel})`;
  }

  zoomIn(): void {
    if (this.zoomTimeout) {
      clearTimeout(this.zoomTimeout);
    }

    this.zoomTimeout = setTimeout(() => {
      if (this.zoomLevel < 2) {  // You can set a maximum zoom level if needed
        this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2);
      }
    }, 100);  // Throttle the zoom actions by 100ms
  }

  zoomOut(): void {
    if (this.zoomTimeout) {
      clearTimeout(this.zoomTimeout);
    }

    this.zoomTimeout = setTimeout(() => {
      if (this.zoomLevel > 0.1) {  // You can set a minimum zoom level if needed
        this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.1);
      }
    }, 100);  // Throttle the zoom actions by 100ms
  }

  startDrag(event: MouseEvent): void {
    this.isDragging = true;
    this.startX = event.clientX - this.offsetX;
    this.startY = event.clientY - this.offsetY;
  }

  stopDrag(): void {
    this.isDragging = false;
  }

  onDrag(event: MouseEvent): void {
    if (this.isDragging) {
      this.offsetX = event.clientX - this.startX;
      this.offsetY = event.clientY - this.startY;
      this.applyTransform();
    }
  }

  applyTransform(): void {
    requestAnimationFrame(() => {
      const zoomContent = document.querySelector('.zoom-content') as HTMLElement;
      zoomContent.style.transform = `scale(${this.zoomLevel}) translate(${this.offsetX}px, ${this.offsetY}px)`;
    });
  }


  // Function to toggle the highlight
  toggleHighlight(): void {
    this.isHighlighted = !this.isHighlighted;
  }
  closePopup() {
    this.isPopupVisible = false;
  }
  zoomdrDag(){
    this.zoomLevel =0.5
  }
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      this.offsetX = event.clientX - this.startX;
      this.offsetY = event.clientY - this.startY;
      const container = document.querySelector('.zoom-content') as HTMLElement;
      container.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.zoomLevel})`;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isDragging = false;
  }
}


