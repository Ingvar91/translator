import {EventEmitter, Injectable, Output} from '@angular/core';
import {ControlValueAccessor, FormControl, Validator} from '@angular/forms';

@Injectable()
export class InputValidation implements ControlValueAccessor, Validator {

  @Output() controlChange = new EventEmitter<string>();

  constructor() {}

  // это начальное значение, установленное для компонента
  public writeValue(obj: any) {}

  // регистрирует 'fn', который будет запущен при внесении изменений
  // так мы возвращаем изменения обратно в форму
  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  // в данном случае нет необходимости проверки, поэтому всегда возвращаем null
  public validate(c: FormControl) {
    return null;
  }

  // используется для сенсорного ввода
  registerOnTouched() { }

  // изменение событий в текстовой области
  onControlChange(event: any): void {
    const newValue = event.target.value;
    this.controlChange.emit(newValue);
    // обновить форму
    this.propagateChange(newValue);
  }

  // метод, установленный в register onChange для отправки изменений обратно в форму
  private propagateChange = (_: any) => { };
}
