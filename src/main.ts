import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import {HttpClientModule, provideHttpClient, withFetch} from '@angular/common/http';
import {provideHotToastConfig} from "@ngxpert/hot-toast";


bootstrapApplication(AppComponent,
  {
    providers: [
      importProvidersFrom(HttpClientModule),
      provideHotToastConfig(), // @ngxpert/hot-toast providers
      provideHttpClient(withFetch())
      // other providers
    ]
  }
)
  .catch((err) => console.error(err));
