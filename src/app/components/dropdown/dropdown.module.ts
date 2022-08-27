import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { DropdownComponent } from './dropdown.component';
import { DropDownDirective } from './dropdown.directive';

@NgModule({
  declarations: [
    DropdownComponent,
    DropDownDirective,
  ],
  exports: [
    DropdownComponent,
    DropDownDirective,
  ],
  imports: [
    CommonModule,
    OverlayModule,
  ],
})
export class DropdownModule { }
