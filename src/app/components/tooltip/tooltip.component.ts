import {ChangeDetectionStrategy, Component, ElementRef, TemplateRef, ViewChild} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Overlay} from "@angular/cdk/overlay";
import {zoomBigMotion} from "../core/animation/zoom";

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    Overlay,
  ],
  animations: [zoomBigMotion],
})
export class TooltipComponent {

  @ViewChild(TemplateRef, {static: true, read: TemplateRef}) templateRef: TemplateRef<TooltipComponent>;
  tooltipTitle$ = new BehaviorSubject<string>('');

  constructor(
    public el: ElementRef,
  ) {}
}
