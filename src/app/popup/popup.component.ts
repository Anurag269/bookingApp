import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BoothBooking } from '../boothBooking';
import { DataserviceService } from '../dataservice.service';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import { PaymentService } from '../payment.service';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
declare var Razorpay: any;  
@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule,FormsModule,
    MatIconModule,MatSelectModule,MatChipsModule,MatFormFieldModule,MatChipsModule,HttpClientModule],
    providers:[DataserviceService,PaymentService,   NgSelectModule,],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent implements OnInit{
  @Input() isVisible!: boolean;
  isShowBookingView :boolean =false
  @Input() seatBooth!: any;
  selectedOptions:any;
  formateRate:any
  @Output() close = new EventEmitter<void>();
  activeTab: string = 'customerDetails';
  booths = ['E4', 'E5', 'E6', 'E7', 'E8', 'E11','E4', 'E5', 'E6', 'E7', 'E8', 'E11',];
  selectedBooth: string = '';
  selectedBoothId:any
  allSeat :any
constructor(private dataService:DataserviceService,private paymentService:PaymentService){
  
}

formData = {
  company_name: '',
  contact_person_name: '',
  email: '',
  contact_number: '',
  booth_ids:[] as number[],
  gstin: '',
  billingAddress: '',
  // selectedBooth: this.allSeat.
};

selectedBooths: string[] = [];

selectedboothids:any

ngOnInit(): void {
  // this.formateRate =[...this.seatBooth]
  this.dataService.getSeatsData().subscribe(
    (data)=>{
this.allSeat = data.data.filter((item:any) => item.booking === null)
      .map((item:any) => item.booth ); 
      const newArray =data.data.find((item:any)=>item.booth === this.formData.booth_ids)
      console.log(newArray)
      this.selectedboothids=data.data
// this.allSeat = data.data.filter((item: any) => item.booking === null);
console.log(this.allSeat,'check all the ')
    }
  )
}

isBoothDisabled(booth: string): boolean {
  return this.selectedBooths.length >= 2 && !this.selectedBooths.includes(booth);
}
// onSubmit(form: NgForm) {
//   if (form.valid) {
//     // if (!Array.isArray(this.formData.booth_ids)) {
//     //   this.formData.booth_ids = [this.formData.booth_ids];
//     // }
//     console.log('FormData Before Mapping:', this.formData.booth_ids);  // Check initial values

//     // Ensure booth_ids is an array
//     if (!Array.isArray(this.formData.booth_ids)) {
//       this.formData.booth_ids = [];  // Reset to an empty array if it's not an array
//     }

//     // Convert booth numbers to booth IDs
//     this.formData.booth_ids = this.formData.booth_ids.map(boothNumber => {
//       const booth = this.selectedboothids.find((b:any) => b.booth === boothNumber);
//       return booth ? booth.id : null;  // Map to ID or null if not found
//     }).filter(id => id !== null) as number[];
//     this.formData.booth_ids = this.formData.booth_ids.map((id:any) => Number(id));
//     console.log('Form Submitted!', this.formData);
//     this.isShowBookingView =true;
//     console.log(this.formData,'check form data')
//     const postData = {
//       ...this.formData, 
//       booth_ids:this.formData.booth_ids
//       // Spread the existing form data  // Extract the id from the selected booth object
//       // Add other necessary fields if required
//     };
//     console.log(postData,'check my postData')
//     console.log(this.selectedOptions)
    
//   }
// }

onSubmit(form: NgForm) {
  if (form.valid) {
    if (!Array.isArray(this.formData.booth_ids)) {
      this.formData.booth_ids = [this.formData.booth_ids];  // Initialize as an empty array if not already an array
    }
    this.formData.booth_ids = this.formData.booth_ids.map(boothNumber => {
      const booth = this.selectedboothids.find((b: any) => b.booth === boothNumber);
      return booth ? booth.id : null;  // Map to ID or null if not found
    }).filter(id => id !== null) as number[];

    // Ensure the IDs are numbers
    this.formData.booth_ids = this.formData.booth_ids.map(id => Number(id));

    // Debugging: Check the final state of booth_ids
    console.log('FormData After Mapping:', this.formData.booth_ids);

    // Proceed with form submission
    this.isShowBookingView = true;

    const postData = {
      ...this.formData, 
      booth_ids: this.formData.booth_ids  // Send the number[] array here
    };
  
this.dataService.postBoothDetails(postData).subscribe((data)=>{
  console.log(data)
  this.onPay(postData.booth_ids)
})
    // Debugging: Check final postData before submission
    console.log('PostData:', postData);
  }
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
    this.activeTab = tabName;
  }

  prevTab() {
    // Logic to navigate to the previous tab
  }

  nextTab() {
    // Logic to navigate to the next tab
  }

  onBook(){
this.isShowBookingView=true
// this.isVisible=false
  }
  // onSubmit(){

  // }
}
