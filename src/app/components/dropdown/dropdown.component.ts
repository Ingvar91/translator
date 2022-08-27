import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { slideMotion } from '../core/animation/slide';

export type DropdownPlacementType = 'top' | 'center' | 'bottom';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [slideMotion],
})
export class DropdownComponent {
  dropDownPosition: DropdownPlacementType = 'bottom';

  @ViewChild(TemplateRef) templateRef: TemplateRef<DropdownComponent>;
}
