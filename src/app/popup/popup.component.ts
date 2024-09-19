import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DataserviceService } from '../dataservice.service';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import { PaymentService } from '../payment.service';
import { HttpClientModule } from '@angular/common/http';
import {NgSelectComponent, NgSelectModule} from '@ng-select/ng-select';
import {ToastComponent} from "../toast/toast.component";
import {ToastService} from "../toast.service";
declare var Razorpay: any;
@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, FormsModule,
    MatIconModule, MatSelectModule, MatChipsModule, MatFormFieldModule, MatChipsModule, HttpClientModule, NgSelectComponent, ToastComponent],
    providers:[DataserviceService,PaymentService,   NgSelectModule,],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent implements OnInit{
  @Input() isVisible!: boolean;
  termsAccepted: boolean = false;
  termsTouched: boolean = false;
  isShowBookingView :boolean =false
  @Input() seatBooth!: any;
  selectedOptions:any;
  formateRate:any
  @Output() close = new EventEmitter<void>();
  activeTab: string = 'customerDetails';
  booths = ['E4', 'E5', 'E6', 'E7', 'E8', 'E11','E4', 'E5', 'E6', 'E7', 'E8', 'E11',];
  selectedBooth: string = '';
  selectedBoothId:any
  allSeat :any;
  formCompleted: boolean = false;
  // showProductDetailes:boolean=false
constructor(private dataService:DataserviceService,private paymentService:PaymentService, private toastService: ToastService){
  this.formData?.booth_ids.push(this.seatBooth?.booth);
}

formData = {
  company_name: '',
  contact_person_name: '',
  email: '',
  contact_number: '',
  booth_ids:[] as number[],
  gstin: '',
  billingAddress: '',
  selectedBooth: []
};
  boothDetails: any = [];
  selectedBOptions: number[] = [];

selectedBooths: string[] = [];

selectedboothids:any;

ngOnInit(): void {
  // this.formateRate =[...this.seatBooth]
  this.dataService.getSeatsData().subscribe(
    (data)=>{
this.allSeat = data.data.filter((item:any) => item.booking === null)
      .map((item:any) => item.booth );
      const newArray =data.data.find((item:any)=>item.booth === this.formData?.booth_ids)
      this.selectedboothids=data.data;
      this.updateBooths();
    }
  )
}

isBoothDisabled(booth: string): boolean {
  return this.selectedBooths.length >= 2 && !this.selectedBooths.includes(booth);
}

onSubmitnext(bookingForm:any){
 if (bookingForm.valid) {
  // this.showProductDetailes =true;
  this.activeTab ='productDetails';
  this.formData.booth_ids=[this.seatBooth?.booth];
  this.updateBooths();
}else{
  console.log('error');
}
}

validateForm(form: NgForm) {
  // Manually mark controls as touched to trigger validation feedback
  Object.keys(form.controls).forEach(controlName => {
    form.controls[controlName].updateValueAndValidity();
  });
}

onSubmit(form: NgForm) {
  if (form.valid) {
    if (!this.termsAccepted) {
      this.termsTouched = true; // Trigger the terms validation message
      return;
    }
    this.isShowBookingView = true;
    const postData = {
      ...this.formData,
      booth_ids: this.boothDetails.map((booth: { id: number; }) => booth.id)
    };

    if (form.invalid) {
      return;
    }
    const formData = new FormData();

// Type assertion to `any` to bypass the error
    Object.keys(postData).forEach((key) => {
      const value = (postData as any)[key];
      console.log(key, value)
      if (Array.isArray(value)) {
        console.log('herer')
        // If the property is an array, append each element
        value.forEach((item: any) => {
          formData.append(`${key}`, item);
        });
      } else {
        // Otherwise, append the property as it is
        formData.append(key, value);
      }
    });
    console.log('formData',formData)
this.dataService.postBoothDetails(formData).subscribe((data)=>{
  this.onPay(data)
})
  }
}

  updateBooths(): void {
    this.boothDetails = this.selectedboothids.filter((b: any) => {
      return this.formData?.booth_ids.find((boothNumber: any) => b.booth === boothNumber);
    });
  }

remove(option: string): void {
  const index = this.selectedOptions.indexOf(option);
  if (index >= 0) {
    this.selectedOptions.splice(index, 1);
  }
}
  closePopup() {
    this.isVisible = false;
    this.close.emit();
  }
  bookclose(){
this.isShowBookingView =false;
// this.formData.
  }

  onPay(data: any) {
    // Set up the Razorpay options
    const options = {
      "key": data.api_key,  // Enter the Key ID generated from the Dashboard
      "amount": data.amount,  // Amount in paise
      "currency": "INR",
      "order_id": data.order_id,  // Order ID from Razorpay
      "handler": (response:any) => {
        this.toastService.showToast('Payment successful! Payment ID: ' + response.razorpay_payment_id, 'success');
        // Trigger the update_payment API with the payment ID
        this.paymentService.updatePayment(response.razorpay_payment_id).subscribe(
          updateData => {
            if (updateData.error) {
              this.toastService.showToast('Error updating payment: ' + updateData.error, 'warning');
            } else {
              this.toastService.showToast('Payment details updated successfully', 'success');
              console.log(updateData);  // Log or handle the updated payment details
              window.location.reload()
            }
          },
          updateError => {
            this.toastService.showToast('Error updating payment: ' + updateError.message, 'warning');
          }
        );
      },
    };

    // Initialize Razorpay Checkout
    const rzp1 = new Razorpay(options);

    // Open the Razorpay payment modal
    rzp1.open();
}

  showSuccess() {

  }

  showWarning() {
    this.toastService.showToast('Warning: Check this out!', 'warning');
  }


  setActiveTab(tabName: string, bookingForm?: any) {
    if (tabName === 'customerDetails') {
      this.activeTab = 'customerDetails';
      return;
    }
    if (tabName === 'productDetails' && this.formCompleted) {
      this.activeTab = 'productDetails';
      this.onSubmitnext(bookingForm);
    }
  }



  prevTab() {
    // Logic to navigate to the previous tab
  }

  nextTab() {
    // Logic to navigate to the next tab
  }


  // validateBoothSelection() {
  //   if (this.formData.booth_ids.length > 2) {
  //     // Custom error for limiting the number of selections
  //     this.boothSelect.control.setErrors({ limitExceeded: true });
  //   } else {
  //     this.boothSelect.control.setErrors(null); // Clear errors if the selection is valid
  //   }
  // }

  onTermsChange() {
    this.termsTouched = true;
    if (!this.termsAccepted) {
      this.termsAccepted = !this.termsAccepted;
    }
  }

  onBook() {
    this.isShowBookingView = true;
    this.formData.booth_ids = [this.seatBooth?.booth];
    this.updateBooths();
  }
}
