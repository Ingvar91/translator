import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from './input-text.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    InputTextComponent
  ],
  exports: [
    InputTextComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class InputTextModule { }
