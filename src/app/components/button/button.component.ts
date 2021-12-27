import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {UpdateClassService} from "../core/update-class.service";
import {IconSpinnerThird} from "../icons/icons/iconSpinnerThird";

export type ButtonType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link';

@Component({
  selector: '[appButton]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.app-btn]': 'true',
  },
  providers: [
    UpdateClassService
  ]
})
export class ButtonComponent implements OnInit {

  iconSpinnerThird = IconSpinnerThird;
  private _isLoading = false;
  @Input() type: ButtonType | string = 'primary';
  @Input() outline: ButtonType | string;

  constructor (
    private el: ElementRef,
    private updateClassService: UpdateClassService,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.setClassMap();
  }

  @Input()
  set isLoading(value: boolean | null) {
    // дизейблим кнопку при загрузке
    if (Boolean(value) === false) {
      this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
    } else if (Boolean(value) === true) {
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
    }
    this._isLoading = Boolean(value);
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  setClassMap() {
    // задаем классы для кнопок в зависимости от типа, для стилизации
    const classMap = {
      [`app-btn__${this.type}`]: this.type && !this.outline,
      [`app-btn__outline-${this.outline}`]: !!this.outline,
    };
    this.updateClassService.updateHostClass(this.el.nativeElement, classMap);
  }


}
