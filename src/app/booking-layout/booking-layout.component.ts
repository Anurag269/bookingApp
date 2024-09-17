import { CommonModule } from '@angular/common';
import { Component, Input, OnInit,Renderer2, ElementRef, ViewChild, ViewChildren, QueryList  } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DataserviceService } from '../dataservice.service';
import { ModelComponent } from '../model/model.component';
import { PopupComponent } from '../popup/popup.component';
import { PopupService } from '../popup.service';
import {MatTooltip} from "@angular/material/tooltip";

interface Seat {
  number: number;
  occupied: boolean;
  selected: boolean;
}
@Component({
  selector: 'app-booking-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButton,
    ModelComponent,
    PopupComponent,
    MatTooltip,
  ],
  providers: [DataserviceService],
  templateUrl: './booking-layout.component.html',
  styleUrl: './booking-layout.component.css',
})
export class BookingLayoutComponent implements OnInit {
  isActive: boolean = false;
  isHighlighted: boolean = false;
  @ViewChild('popup') popup!: PopupComponent;
  BookingData: any;
  greenSeatrow: any;
  firstRowBooths: any;
  secondRowBooths: any;
  thirdRowBooth: any;
  forthRowBooth: any;
  fifthRowBooth: any;
  eRowArray: any;
  newCombinedInE: any;
  combinedArray: any;
  boothsStartingWithG: any;
  boothsStartingWithB: any;
  boothsStartingWithD: any;
  boothsStartingWithCP: any;
  popoverVisible = false;
  popoverData: any = {};
  popoverPosition = { top: 0, left: 0 };
  greenSeatFixedLayout = [
    { position: 'C39', id: null },
    { position: 'C40', id: null },
    { position: 'C41', id: null },
    { position: 'C42', id: null },
    { position: 'C43', id: null },
  ];
  showPopup = false;
  combinethirdRow: any;
  // @ViewChild('popup', { static: false }) popup!: ElementRef;

  @ViewChildren('boothButton') buttons!: QueryList<ElementRef>;
  filteredBoothNumbers: string[] = [];
  @Input() seatData: any;
  @Input() zoomLevel:any;
  zoomedSeat: any = null; // Variable to track which seat is zoomed

  // Method to zoom the clicked grid/seat
  zoomGrid(seat: any): void {
    // Check if a seat is already zoomed, if yes, reset
    if (this.zoomedSeat === seat) {
      this.zoomedSeat = null;
    } else {
      // Zoom the clicked seat
      this.zoomedSeat = seat;
    }
  }

  // Check if the current seat is zoomed for applying the zoom class
  isZoomed(seat: any): boolean {
    return this.zoomedSeat === seat;
  }
  constructor(
    private dataService: DataserviceService,
    private renderer: Renderer2,
    private popupService: PopupService
  ) {}
  seatsthird = [
    { label: 'A1', columnStart: 1, rowStart: 1 },
    { label: 'A2', columnStart: 2, rowStart: 1 },
    { label: 'A3', columnStart: 3, rowStart: 1 },
    { label: 'B1', columnStart: 1, rowStart: 2 },
    { label: 'B2', columnStart: 3, rowStart: 2 },
    { label: 'A1', columnStart: 1, rowStart: 1 },
    { label: 'A2', columnStart: 2, rowStart: 1 },
    { label: 'A3', columnStart: 3, rowStart: 1 },
    { label: 'B1', columnStart: 1, rowStart: 2 },
    { label: 'B2', columnStart: 3, rowStart: 2 },
    { label: 'B1', columnStart: 1, rowStart: 2 },
    { label: 'B2', columnStart: 3, rowStart: 2 },
    // Add more seats here with their grid positions
  ];
  text = '8X8';
  seatsthirdright = [
    { label: 'A1', columnStart: 1, rowStart: 1 },
    { label: 'A2', columnStart: 2, rowStart: 1 },
    { label: 'A3', columnStart: 3, rowStart: 1 },
    { label: 'B1', columnStart: 1, rowStart: 2 },
    { label: 'B2', columnStart: 3, rowStart: 2 },
    { label: 'A1', columnStart: 1, rowStart: 1 },
    { label: 'A2', columnStart: 2, rowStart: 1 },
    { label: 'A3', columnStart: 3, rowStart: 1 },
    { label: 'B1', columnStart: 1, rowStart: 2 },
    { label: 'B2', columnStart: 3, rowStart: 2 },
    // Add more seats here with their grid positions
  ];

  seats = [
    { label: 'A1', columnStart: 1, rowStart: 1 },
    { label: 'A2', columnStart: 2, rowStart: 1 },
    { label: 'A3', columnStart: 3, rowStart: 1 },
    { label: 'B1', columnStart: 1, rowStart: 2 },
    { label: 'B2', columnStart: 3, rowStart: 2 },
    // Add more seats here with their grid positions
  ];
  Secseats = [
    { label: 'A1', columnStart: 1, rowStart: 1 },
    { label: 'A2', columnStart: 2, rowStart: 1 },

    // Add more seats here with their grid positions
  ];
  thiseats = [
    { label: 'A1', columnStart: 1, rowStart: 1 },
    { label: 'A2', columnStart: 2, rowStart: 1 },
    { label: 'A3', columnStart: 3, rowStart: 1 },
    { label: 'B1', columnStart: 1, rowStart: 2 },
    { label: 'B2', columnStart: 3, rowStart: 2 },
    { label: 'A1', columnStart: 1, rowStart: 1 },
    { label: 'A2', columnStart: 2, rowStart: 1 },
    { label: 'A3', columnStart: 3, rowStart: 1 },
  ];

  ngOnInit(): void {
    this.dataService.getSeatsData().subscribe((data) => {
      this.BookingData = data.data;
      this.filteredBoothNumbers = this.extractAndReverseBoothNumbers(
        this.BookingData
      );
      this.extractWithEIn(this.BookingData);

      this.greenSeatrow;
    });
  }

  ngAfterViewInit() {
    this.BookingData.forEach((booth: any) => {
      const button = this.buttons?.find(
        (btn) => btn.nativeElement.innerText === booth.booth
      );
      if (button) {
        button.nativeElement.textContent = `${booth.booth}`;
        button.nativeElement.setAttribute('data-id', booth.id);
        button.nativeElement.setAttribute('title', booth.category);
      }
    });
  }

  getBoothClass(booth: any): { [klass: string]: boolean } {
    return {
      'booked-by-admin': booth?.booking?.admin,
      'booked-by-user': booth?.booking && !booth.booking.admin,
      'not-booked': !booth?.booking,
    };
  }
  selectSeat(seat: Seat): void {
    if (!seat.occupied) {
      seat.selected = !seat.selected;
    }
  }
  showModal = false;

  toggleModal() {
    this.showModal = !this.showModal;
  }

  closeModal() {
    this.showModal = false;
  }

  getBoothByBoothNumber(boothNumber: any): any {
    const booth = this.BookingData?.find(
      (booth: any) => booth.booth === boothNumber
    );
    return booth;
  }

  showPopover(boothData: any, event: MouseEvent): void {
    this.popoverData = boothData;
    this.popoverPosition = {
      top: event.clientY - 80, // Adjust these values to position the popover correctly
      left: event.clientX - 80,
    };
    this.popoverVisible = true;
  }
  getSeatClass() {}
  openPopup(seatBooth: any) {
    // Get the specific button (C29) by using querySelector or by targeting with an event
    const button = document.querySelector("button:nth-child(1)");

// Get the coordinates of the button
    const rect = button?.getBoundingClientRect();
    console.log("Button C29 Coordinates:", rect);

// Zoom into that specific point (C29)
    const zoomElement = document.querySelector("body"); // Element you want to zoom in on
if (zoomElement && rect) {
  // Apply zoom using CSS transformation and translate to the button's coordinates
  zoomElement.style.transformOrigin = `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`;
  zoomElement.style.transform = "scale(1)"; // Change the scale to zoom in more or less
  zoomElement.style.transition = "transform 0.5s ease";
}
    // this.zoomInGrid(seatBooth);
    this.popupService.showPopup(seatBooth);
  }

  zoomInGrid(seat: any): void {
    const seatElement = document.getElementById(`seat-${seat.id}`);

    if (this.zoomedSeat === seat) {
      // Reset zoom on the seat
      this.zoomedSeat = null;
      if (seatElement) {
        this.renderer.setStyle(seatElement, 'transform', 'scale(1)');
        this.renderer.setStyle(seatElement, 'z-index', '1');
        this.renderer.setStyle(seatElement, 'position', 'initial');
        this.renderer.setStyle(seatElement, 'border', 'none');
      }
    } else {
      // Zoom in on the clicked seat
      this.zoomedSeat = seat;
      if (seatElement) {
        this.renderer.setStyle(seatElement, 'transform', 'scale(2)');
        this.renderer.setStyle(seatElement, 'z-index', '100');
        this.renderer.setStyle(seatElement, 'position', 'relative');
      }
    }
  }

  onButtonClick(booth: any): void {
  }

  extractAndReverseBoothNumbers(apiData: any[]) {
    const boothsStartingWithK = apiData.filter((booth) =>
      booth.booth.startsWith('K')
    );
    this.boothsStartingWithG = apiData
      .filter((booth) => booth.booth.startsWith('G'))
      .reverse();
    this.boothsStartingWithB = apiData
      .filter((booth) => booth.booth.startsWith('B'))
      .reverse();
    this.boothsStartingWithD = apiData
      .filter((booth) => booth.booth.startsWith('D'))
      .reverse();
    this.boothsStartingWithCP = apiData
      .filter((booth) => booth.booth.startsWith('CP'))
      .reverse();
    this.splitBooths(boothsStartingWithK.reverse());
    return boothsStartingWithK.reverse();
  }

  extractWithEIn(apiData: any[]) {
    const boothsStartingWithE = apiData.filter((booth) =>
      booth.booth.startsWith('E')
    );

    // Filter items starting with 'IN'
    const boothsStartingWithIN = apiData.filter((booth) =>
      booth.booth.startsWith('IN')
    );
    // Combine arrays if needed or handle them separately
    const combinedBooths = [...boothsStartingWithE, ...boothsStartingWithIN];
    const firstSixValues = boothsStartingWithIN.slice(0, 6);
    const lastfourEvalues = combinedBooths.slice(16, 20).reverse();
    this.combinethirdRow = [...firstSixValues, ...lastfourEvalues];
    const firsthalfEthird = combinedBooths.slice(4, 10).reverse();
    const secondHalfEthird = combinedBooths.slice(10, 16);
    this.eRowArray = [...secondHalfEthird, ...firsthalfEthird];
    const inKRow = boothsStartingWithE.slice(0, 2).reverse();
    const inRow = boothsStartingWithIN.slice(6, 11);
    const secERow = boothsStartingWithE.slice(2, 4);
    const secInRow = boothsStartingWithIN.slice(11, 16).reverse();
    this.newCombinedInE = [...secERow, ...inRow, ...inKRow, ...secInRow];
  }

  getButtonClass(booth: any): string {
    if (booth['booking']['admin'] === true) {
      return booth.booking.admin !== null && true
        ? 'admin-booked-seat'
        : 'regular-booked-seat';
    }
    return booth.booking !== null ? 'booked-seat' : 'available-seat';
  }

  hidePopover(): void {
    this.popoverVisible = false;
  }
  getButtonClasses(): { [klass: string]: any } {
    return {
      'active-class': this.isActive,
      'highlighted-class': this.isHighlighted,
    };
  }
  splitBooths(apiData: any[]) {
    // Split the data into two parts
    this.firstRowBooths = apiData.slice(0, 13).reverse(); // First 10 objects
    this.secondRowBooths = apiData.slice(13, 21);
    this.thirdRowBooth = apiData.slice(21, 29);
    this.forthRowBooth = apiData.slice(29, 37);
    this.fifthRowBooth = apiData.slice(37, 45);

    const middleIndex = Math.floor(this.secondRowBooths.length / 2);
    const firstHalf = this.secondRowBooths.slice(0, middleIndex);
    const secondHalf = this.secondRowBooths;

    // Reverse each half
    const reversedFirstHalf = firstHalf.reverse();
    const reversedSecondHalf = secondHalf.reverse();

    // Combine the reversed halves into one array
    this.combinedArray = reversedFirstHalf.concat(reversedSecondHalf);
  }
}
