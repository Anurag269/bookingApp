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
declare var Razorpay: any;
@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, FormsModule,
    MatIconModule, MatSelectModule, MatChipsModule, MatFormFieldModule, MatChipsModule, HttpClientModule, NgSelectComponent],
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
constructor(private dataService:DataserviceService,private paymentService:PaymentService){
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
      console.log(newArray)
      this.selectedboothids=data.data;
      this.updateBooths();
// this.allSeat = data.data.filter((item: any) => item.booking === null);
console.log(this.allSeat,'check all the ')
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
  console.log('errpr');
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
      booth_ids: this.formData?.booth_ids  // Send the number[] array here
    };

    if (form.invalid) {
      return;
    }
    const formData = new FormData();

// Type assertion to `any` to bypass the error
    Object.keys(postData).forEach((key) => {
      const value = (postData as any)[key];

      if (Array.isArray(value)) {
        // If the property is an array, append each element
        value.forEach((item: any) => {
          formData.append(`${key}`, item);
        });
      } else {
        // Otherwise, append the property as it is
        formData.append(key, value);
      }
    });
this.dataService.postBoothDetails(formData).subscribe((data)=>{
  console.log(data)
  this.onPay(postData.booth_ids)
})
    // Debugging: Check final postData before submission
    console.log('PostData:', postData);
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
toggleSelection(booth:any,ninw:any){
console.log(booth,ninw)
}
  closePopup() {
    this.isVisible = false;
    this.close.emit();
  }
  bookclose(){
this.isShowBookingView =false;
// this.formData.
  }

  onPay(id:any) {
    // console.log()
    // Fetch the order details from the backend
    this.paymentService.createOrder(id).subscribe(
      data => {
        if (data.error) {
          alert(data.error);
          return;
        }

        // Set up the Razorpay options
        const options = {
          "key": data.api_key,  // Enter the Key ID generated from the Dashboard
          "amount": data.amount,  // Amount in paise
          "currency": "INR",
          "order_id": data.order_id,  // Order ID from Razorpay
          "handler": (response:any) => {
            alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);

            // Trigger the update_payment API with the payment ID
            this.paymentService.updatePayment(response.razorpay_payment_id).subscribe(
              updateData => {
                if (updateData.error) {
                  alert('Error updating payment: ' + updateData.error);
                } else {
                  alert('Payment details updated successfully');
                  console.log(updateData);  // Log or handle the updated payment details
                }
              },
              updateError => {
                alert('Error updating payment: ' + updateError.message);
              }
            );
          },
        };

        // Initialize Razorpay Checkout
        const rzp1 = new Razorpay(options);

        // Open the Razorpay payment modal
        rzp1.open();
      },
      error => {
        console.error('Error:', error);
      }
    );
  }


  setActiveTab(tabName: string) {
    if (tabName === 'customerDetails') {
      this.activeTab = 'customerDetails';
      return;
    }
    if (tabName === 'productDetails' && this.formCompleted) {
      this.activeTab = 'productDetails';
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

  onBook(){
this.isShowBookingView=true
// this.isVisible=false
  }
  // onSubmit(){

  // }
}
