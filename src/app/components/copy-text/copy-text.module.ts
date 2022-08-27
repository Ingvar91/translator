import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyTextComponent } from './copy-text.component';
import { IconsModule } from '../icons/icons.module';

@NgModule({
  exports: [
    CopyTextComponent,
  ],
  declarations: [
    CopyTextComponent,
  ],
  imports: [
    CommonModule,
    IconsModule,
  ],
})
export class CopyTextModule { }
