import {Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {DataserviceService} from "./dataservice.service";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet, CommonModule, HttpClientModule
  ],
  providers: [DataserviceService],
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  constructor(
    private dataService: DataserviceService
  ) {
  }

  ngOnInit(): void {
    this.dataService.clearSessionId();
  }

}
