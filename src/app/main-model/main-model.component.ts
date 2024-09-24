import {Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {Subject} from "rxjs";
import {PopupService} from "../popup.service";
import {DataserviceService} from "../dataservice.service";
import {Router, RouterOutlet} from "@angular/router";
import {CommonModule, isPlatformBrowser, NgStyle} from "@angular/common";
import {BookingLayoutComponent} from "../booking-layout/booking-layout.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {CdkDrag, DragDropModule} from "@angular/cdk/drag-drop";
import {MatIconModule} from "@angular/material/icon";
import {HttpClientModule} from "@angular/common/http";
import {ModelComponent} from "../model/model.component";
import {PopupComponent} from "../popup/popup.component";
import {MatTooltip} from "@angular/material/tooltip";
import {LoginPageComponent} from "../login-page/login-page.component";
import {HotToastService} from "@ngxpert/hot-toast";

@Component({
  selector: 'app-main-model',
  standalone: true,
  imports: [RouterOutlet, BookingLayoutComponent, MatToolbarModule, CommonModule, CdkDrag,
    MatIconModule, DragDropModule, HttpClientModule, ModelComponent, PopupComponent, MatIconModule, NgStyle, MatTooltip, LoginPageComponent],
  providers: [DataserviceService],
  templateUrl: './main-model.component.html',
  styleUrl: './main-model.component.css'
})
export class MainModelComponent implements OnInit {
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
  isPopupVisible = false;
  selectedSeatBooth!: string;
  private isInitialized = false;
  private zoomSubject = new Subject<number>();
  @ViewChild('zoomableContent') zoomableContent!: ElementRef;
  @ViewChild('dragRoot') dragRoot: ElementRef | undefined;
  showLoginkey = false;

  constructor(private popupService: PopupService, protected dataService:DataserviceService, @Inject(PLATFORM_ID) private platformId: Object, private router: Router,private toast: HotToastService) {}

  ngOnInit() {
    this.popupService.popupVisibility$.subscribe(seatBooth => {
      if (this.isInitialized) {
        this.selectedSeatBooth = seatBooth;
        this.isPopupVisible = true;
      }
    });
    this.dataService.getSummeryData().subscribe((data:any)=>{
      this.summeryItems=data;
      this.zoomdrDag();
    })
    this.isInitialized = true;
    this.zoomSubject.subscribe((zoom) => {
      this.zoomLevel = zoom;
    });
  }

  get zoomTransform(): string {
    return `scale(${this.zoomLevel})`;
  }

  zoomIn(): void {
    this.zoomSubject.next(Math.min(this.zoomLevel + 0.1, 6)); // Cap at max zoom level (6x)
  }

  zoomOut(): void {
    this.zoomSubject.next(Math.max(this.zoomLevel - 0.1, 0.1)); // Minimum zoom level (0.1x)
  }

  @HostListener('wheel', ['$event'])
  onMouseWheel(event: WheelEvent): void {
    event.preventDefault();
    const zoomAmount = event.deltaY > 0 ? -0.1 : 0.1;
    this.zoomSubject.next(Math.max(0.1, Math.min(this.zoomLevel + zoomAmount, 6)));
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
    // const dragElement = this.zoomableContent?.nativeElement;
    // // Reset the transform style to its original position
    // if (dragElement) {
    //   dragElement.style.transform = 'none'; // Resets the transform to initial state
    // }
    this.zoomSubject.next(0.4);

    // Reset drag position manually by resetting transform
    if (this.dragRoot) {
      const dragEl = this.dragRoot.nativeElement;
      dragEl.style.transform = 'none'; // Reset transform to original position
      dragEl.style.left = '0px'; // Reset left position (if moved)
      dragEl.style.top = '0px'; // Reset top position (if moved)
      // Check if the screen width is below a certain threshold (mobile view)
      if (isPlatformBrowser(this.platformId)) {
        const isMobile = window?.innerWidth <= 768; // You can adjust the width value as needed

        if (isMobile) {
          this.zoomSubject.next(0.3);
          dragEl.style.position = 'relative';
          // Apply different behavior for mobile view, allowing more dragging to the left
          dragEl.style.left = '-420px'; // Allow more leftward drag (adjust value as needed)

        }
      }
    }
  }
  // @HostListener('document:mousemove', ['$event'])
  // onMouseMove(event: MouseEvent): void {
  //   if (this.isDragging) {
  //     this.offsetX = event.clientX - this.startX;
  //     this.offsetY = event.clientY - this.startY;
  //     const container = document.querySelector('.zoom-content') as HTMLElement;
  //     container.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.zoomLevel})`;
  //   }
  // }

  // @HostListener('document:mouseup')
  // onMouseUp(): void {
  //   this.isDragging = false;
  // }

  showSummaryTableDetails(): void {
    this.showSummaryTable = true;
  }

  minimizeSummaryTableDetails(): void {
    this.showSummaryTable = false;
  }

  showLogin(): void {
    this.showLoginkey = true;
  }

  hideLogin(): void {
    this.showLoginkey = false;
  }

  isLoginVisible = false;

  // Method to toggle the login page visibility
  toggleLogin(): void {
    this.isLoginVisible = true;
    this.router.navigate(['/login']);
  }

  userLogout(): void {
    this.dataService.userLogout().subscribe({
      next: () => {
        this.toast.success('Logged Out Successfully', {
          duration: 3000,
          position: 'top-right'
        });
        this.dataService.clearSessionId();
        this.router.navigate(['']);
      },
      error: (err) => {
        this.toast.error('Error logging out.', {
          duration: 3000,
          position: 'top-right'
        });
      }
    })
  }

  getBookingDetails() {
    this.dataService.downloadBoothDetails().subscribe({
      next: () => {
        this.toast.success('Booth Details Downloaded successfully.', {
          duration: 3000,
          position: 'top-right'
        });
      },
      error: (err) => {
        this.toast.error('Unable to download Booth Details', {
          duration: 3000,
          position: 'top-right'
        });
      }
    })
  }
}
