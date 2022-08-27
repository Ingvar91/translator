import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() height: number;

  @Input() placeholder: string;

  @Input() maxLength = 300;

  @ViewChild('input') input: ElementRef;

  destroy$ = new Subject<void>();

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    this.ngControl?.valueChanges?.pipe(takeUntil(this.destroy$)).subscribe((text) => {
      this.ngControl.control?.setValue(text?.substring(0, this.maxLength) || '', { emitEvent: false });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  registerOnChange(): void {}

  registerOnTouched(): void {}

  writeValue(): void {}
}
