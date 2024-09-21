import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";

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
  constructor(private router: Router) {}
  // Create FormGroup with FormControls for email and password
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  // Method to handle login form submission
  onLogin(): void {
    if (this.loginForm.valid) {
      console.log('Login Successful', this.loginForm.value);
      this.router.navigate(['']);
    } else {
      this.loginForm.markAllAsTouched();  // Ensures validation messages show after submission attempt
      console.log('Form is invalid');
    }
  }
}
