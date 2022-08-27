import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatorComponent } from './translator.component';
import { DropdownModule } from '../../components/dropdown/dropdown.module';
import { IconsModule } from '../../components/icons/icons.module';
import { InputTextModule } from '../../components/input/input-text/input-text.module';
import { ButtonModule } from '../../components/button/button.module';
import { CopyTextModule } from '../../components/copy-text/copy-text.module';
import { TooltipModule } from '../../components/tooltip/tooltip.module';

@NgModule({
  declarations: [
    TranslatorComponent,
  ],
  exports: [
    TranslatorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    IconsModule,
    InputTextModule,
    ButtonModule,
    CopyTextModule,
    TooltipModule,
    ReactiveFormsModule,
  ],
})
export class TranslatorModule { }
