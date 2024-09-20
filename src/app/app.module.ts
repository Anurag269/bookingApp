import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { ModelComponent } from './model/model.component';
import { MatSelectModule } from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatChipsModule} from '@angular/material/chips'
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {provideHotToastConfig} from "@ngxpert/hot-toast";
import {provideHttpClient, withFetch} from "@angular/common/http";

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    ModelComponent,
    MatSelectModule,
    MatFormFieldModule,MatChipsModule,
    CommonModule,
    FormsModule
  ],
  providers: [provideHotToastConfig(),
    provideHttpClient(withFetch())],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
