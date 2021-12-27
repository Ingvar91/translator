import {ChangeDetectionStrategy, Component, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {slideMotion} from "../core/animation/slide";

export type DropdownPlacementType = 'top' | 'bottom';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [slideMotion]
})
export class DropdownComponent {

  dropDownPosition: 'top' | 'center' | 'bottom' = 'bottom';
  @ViewChild(TemplateRef, {static: true, read: TemplateRef}) templateRef: TemplateRef<DropdownComponent>;
}
