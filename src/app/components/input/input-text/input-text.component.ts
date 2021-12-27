import {ChangeDetectionStrategy, Component, ElementRef, forwardRef, Input, ViewChild} from '@angular/core';
import {InputValidation} from "../input-validation";
import {NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    }
  ]
})
export class InputTextComponent extends InputValidation {
  private _control: string;
  @Input() height: number;
  @Input() placeholder: string;
  @Input() maxLength = 600;

  @ViewChild('input', { static: true }) input: ElementRef;

  get control(): string {
    return this._control;
  }

  @Input()
  set control(text: string) {
    text = text?.substring(0, this.maxLength) || '';
    this._control = text;
    this.input.nativeElement.value = text;
  }
}
