import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import {HttpClientModule, provideHttpClient, withFetch} from '@angular/common/http';
import {provideHotToastConfig} from "@ngxpert/hot-toast";
import {LoginPageComponent} from "./app/login-page/login-page.component";
import {provideRouter, Routes} from "@angular/router";
import {MainModelComponent} from "./app/main-model/main-model.component";

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },  // Default route to LoginPageComponent
  { path: '', component: MainModelComponent }     // Route for AppComponent (main application)
];
bootstrapApplication(AppComponent,
  {
    providers: [
      importProvidersFrom(HttpClientModule),
      provideHotToastConfig(), // @ngxpert/hot-toast providers
      provideHttpClient(withFetch()),
      provideRouter(routes)
      // other providers
    ]
  }
)
  .catch((err) => console.error(err));
