import { ChangeDetectionStrategy, Component, ElementRef, Input, Optional, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent implements ControlValueAccessor {
  @Input() height: number;

  @Input() placeholder: string;

  @Input() maxLength = 600;

  @ViewChild('input') input: ElementRef;

  onChange!: (value: number | null) => void;

  onTouched!: (value: number | null) => void;

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(): void {}
}
