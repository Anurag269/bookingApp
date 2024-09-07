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
import {Subject, debounceTime, switchMap, timer, interval} from "rxjs";
import {CommonModule, NgStyle} from "@angular/common";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BookingLayoutComponent, MatToolbarModule, CommonModule,
    MatIconModule, DragDropModule, HttpClientModule, ModelComponent, PopupComponent, MatIconModule, NgStyle],
    providers: [DataserviceService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'bookinglayout';
  zoomLevel: number = 0.5;
  isDragging: boolean = false;
  summeryItems:any
  startX: number = 0;
  isHighlighted: boolean = false;
  showSummaryTable: boolean = false;
  startY: number = 0;
  offsetX: number = 0;
  offsetY: number = 0;
  BookingData: any;
  isPopupVisible = false;
  selectedSeatBooth!: string;
  zoomTimeout: any;
  private isInitialized = false;
  private zoomSubject = new Subject<number>();
  constructor(private popupService: PopupService,private dataService:DataserviceService) {}

  ngOnInit() {
    this.popupService.popupVisibility$.subscribe(seatBooth => {
      if (this.isInitialized) {
        this.selectedSeatBooth = seatBooth;
        this.isPopupVisible = true;
      }
    });
    this.dataService.getSummeryData().subscribe((data:any)=>{
     this.summeryItems=data
    })
    this.isInitialized = true;
    this.zoomSubject.pipe(
      debounceTime(0.1),  // Adjust the debounce time as needed
      switchMap(zoomLevel => {
        return timer(0, 0.1).pipe(
          switchMap(() => {
            if (this.zoomLevel !== zoomLevel) {
              this.zoomLevel = zoomLevel;
              return interval(0);
            } else {
              return [];
            }
          })
        );
      })
    ).subscribe();
  }

  get zoomTransform(): string {
    return `scale(${this.zoomLevel})`;
  }

  zoomIn(): void {
    this.zoomSubject.next(Math.min(this.zoomLevel + 0.1, 2));
  }

  zoomOut(): void {
    this.zoomSubject.next(Math.max(this.zoomLevel - 0.1, 0.1));
  }

  @HostListener('wheel', ['$event'])
  onMouseWheel(event: WheelEvent): void {
    event.preventDefault();
    const zoomAmount = event.deltaY > 0 ? -0.1 : 0.1;
    this.zoomSubject.next(Math.max(0.1, Math.min(this.zoomLevel + zoomAmount, 2)));
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


  toggleHighlight(): void {
    this.isHighlighted = !this.isHighlighted;
  }
  closePopup() {
    this.isPopupVisible = false;
  }
  zoomdrDag(){
    this.zoomSubject.next(0.5);
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

  showSummaryTableDetails(): void {
    this.showSummaryTable = true;
  }

  minimizeSummaryTableDetails(): void {
    this.showSummaryTable = false;
  }
}


