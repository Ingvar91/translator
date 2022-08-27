import {
  AfterViewInit,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { FlexibleConnectedPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { BehaviorSubject, EMPTY, fromEvent, merge, Subject, Subscription, switchMap, takeUntil } from 'rxjs';
import { auditTime, distinctUntilChanged, filter, mapTo } from 'rxjs/operators';
import { TemplatePortal } from '@angular/cdk/portal';
import { ESCAPE } from '@angular/cdk/keycodes';
import { TooltipComponent } from './tooltip.component';
import { POSITION_MAP } from '../core/overlay/overlay-position';

export type PlacementTooltipType = 'topCenter' | 'bottomCenter';

@Directive({
  selector: '[appTooltip]',
  providers: [
    Overlay,
  ],
})
export class TooltipDirective implements AfterViewInit, OnDestroy {
  @Input() trigger: 'click' | 'hover' = 'hover';

  @Input() minWidth: number = 50;

  @Input() placement: PlacementTooltipType = 'topCenter'; // позиционирование tooltip

  @Output() tooltipVisibleChange: EventEmitter<boolean> = new EventEmitter();

  _tooltipTitle: string;

  private componentRef: ComponentRef<TooltipComponent>;

  private trigger$ = new BehaviorSubject<'click' | 'hover'>(this.trigger);

  protected destroy$ = new Subject();

  protected portal: TemplatePortal;

  protected overlayRef: OverlayRef | null;

  private overlayClose$ = new Subject<boolean>();

  private overlay$: Subscription;

  private listOfPositions = [
    POSITION_MAP.topCenter,
    POSITION_MAP.bottomCenter,
  ];

  constructor(
    public el: ElementRef,
    private renderer: Renderer2,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
  ) { }

  @Input()
  set tooltipTitle(tooltipTitle: string) {
    this._tooltipTitle = tooltipTitle;
    if (this.componentRef) {
      this.componentRef.instance.tooltipTitle$.next(this.tooltipTitle);
    }
  }

  get tooltipTitle(): string {
    return this._tooltipTitle;
  }

  ngAfterViewInit() {
    // создаем компонент
    this.componentRef = this.viewContainerRef.createComponent(TooltipComponent);

    const { nativeElement } = this.el;
    const hostMouseState$ = merge(
      fromEvent(nativeElement, 'mouseenter').pipe(mapTo(true)),
      fromEvent(nativeElement, 'mouseleave').pipe(mapTo(false)),
    );
    const hostClickState$ = fromEvent(nativeElement, 'click').pipe(mapTo(true));

    const visibleStateByTrigger$ = this.trigger$.pipe(
      switchMap(() => {
        if (this.trigger === 'hover') {
          return hostMouseState$;
        } if (this.trigger === 'click') {
          return hostClickState$;
        }
        return EMPTY;
      }),
    );

    merge(hostClickState$, visibleStateByTrigger$, this.overlayClose$).pipe(
      auditTime(150),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe((visible: boolean) => {
      this.tooltipVisibleChange.emit(visible);
      if (visible) {
        const positionStrategy: FlexibleConnectedPositionStrategy = this.overlay
          .position()
          .flexibleConnectedTo(this.el.nativeElement)
          .withLockedPosition();

        if (this.tooltipTitle) this.componentRef.instance.tooltipTitle$.next(this.tooltipTitle);
        if (!this.portal || this.portal.templateRef !== this.componentRef.instance.templateRef) {
          this.portal = new TemplatePortal(this.componentRef.instance.templateRef, this.viewContainerRef);
        }
        if (!this.overlayRef) {
          this.overlayRef = this.overlay.create({
            positionStrategy,
            disposeOnNavigation: true,
            minWidth: this.minWidth,
            scrollStrategy: this.overlay.scrollStrategies.close(),
          });
          this.overlay$ = merge(
            this.overlayRef.backdropClick(),
            this.overlayRef.detachments(),
            this.overlayRef.outsidePointerEvents(),
            this.overlayRef.keydownEvents().pipe(filter((e) => e.keyCode === ESCAPE)),
          )
            .pipe(mapTo(false), takeUntil(this.destroy$))
            .subscribe(this.overlayClose$);
        }
        positionStrategy.withPositions([POSITION_MAP[this.placement], ...this.listOfPositions]);
        positionStrategy.withPush(true);
        this.overlayRef.attach(this.portal);
      } else if (this.overlayRef) {
        this.overlayRef.detach();
        this.overlayRef = null;
        this.overlay$.unsubscribe();
      }
    });
  }

  ngOnDestroy() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null;
      this.overlay$.unsubscribe();
    }
  }
}
