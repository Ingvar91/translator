import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextComponent } from './input-text.component';

@NgModule({
  declarations: [InputTextComponent],
  exports: [InputTextComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class InputTextModule {}
