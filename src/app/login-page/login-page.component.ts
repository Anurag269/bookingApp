import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";
import {DataserviceService} from "../dataservice.service";
import {HotToastService} from "@ngxpert/hot-toast";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  constructor(private router: Router, private dataservice: DataserviceService, private toast: HotToastService) {}
  // Create FormGroup with FormControls for username and password
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required,
      // Validators.email
    ]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  // Method to handle login form submission
  onLogin(): void {
    if (this.loginForm.valid) {
      const formData = new FormData();
      formData.append('username', this.loginForm.get('username')?.value ?? '');
      formData.append('password', this.loginForm.get('password')?.value ?? '');

      this.dataservice.userLogin(formData).subscribe({
        next: ((res) => {
          this.toast.success('Logged in successfully', {
            duration: 3000,
            position: 'top-right'
          });
          this.dataservice.storeSessionId();
          this.router.navigate(['']);
        }),
        error: (e) => {
          this.toast.error('Unable to login', {
            duration: 3000,
            position: 'top-right'
          });
        }
      })
    } else {
      this.loginForm.markAllAsTouched();  // Ensures validation messages show after submission attempt
      console.log('Form is invalid');
    }
  }
}
