import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import { FlexibleConnectedPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { auditTime, distinctUntilChanged, filter, map, mapTo, takeUntil } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { merge } from 'rxjs/internal/observable/merge';
import { Subject } from 'rxjs/internal/Subject';
import { ESCAPE } from '@angular/cdk/keycodes';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs/internal/Subscription';
import { DropdownComponent } from './dropdown.component';
import { POSITION_MAP } from '../core/overlay/overlay-position';

export type PlacementDropdownType = 'topLeft' | 'bottomLeft';

@Directive({
  selector: '[appDropdown]',
  providers: [
    Overlay,
  ],
})
export class DropDownDirective implements AfterViewInit, OnDestroy, OnChanges {
  @Input() dropdown: DropdownComponent; // компонент который мы передали

  @Input() visible = false; // видим или невидим dropdown

  @Input() placement: PlacementDropdownType = 'topLeft'; // позиционирование dropdown

  @Input() minWidth = 180; // минимальная ширина dropdown

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();

  private dropdownVisible$ = new BehaviorSubject<boolean>(false);

  private overlayClose$ = new Subject<boolean>();

  private portal: TemplatePortal;

  private destroy$ = new Subject<void>();

  private overlayRef: OverlayRef | null = null;

  private overlay$: Subscription;

  private positionChanges$: Subscription;

  private listOfPositions = [
    POSITION_MAP.topLeft,
    POSITION_MAP.bottomLeft,
  ];

  constructor(
    public el: ElementRef,
    private renderer: Renderer2,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
  ) {}

  ngAfterViewInit(): void {
    if (this.dropdown) {
      const { nativeElement } = this.el;
      const hostClickState$ = fromEvent(nativeElement, 'click').pipe(map(() => !this.visible));
      const domTriggerVisible$ = merge(hostClickState$, this.overlayClose$);
      const visible$ = merge(this.dropdownVisible$, domTriggerVisible$);

      visible$.pipe(
        map((visible) => visible),
        auditTime(150),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
        .subscribe((visible: boolean) => {
          this.visible = visible;
          this.visibleChange.emit(visible);
          if (visible) {
            const positionStrategy: FlexibleConnectedPositionStrategy = this.overlay
              .position()
              .flexibleConnectedTo(this.el.nativeElement)
              .withLockedPosition();

            // настроить контейнер
            if (!this.overlayRef) {
              this.overlayRef = this.overlay.create({
                positionStrategy,
                width: this.triggerWidth,
                minWidth: this.minWidth,
                disposeOnNavigation: true,
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
            } else {
              const overlayConfig = this.overlayRef.getConfig();
              overlayConfig.minWidth = this.minWidth;
              overlayConfig.width = this.triggerWidth;
            }
            positionStrategy.withPositions([POSITION_MAP[this.placement], ...this.listOfPositions]);
            positionStrategy.withPush(true);
            if (!this.portal || this.portal.templateRef !== this.dropdown.templateRef) {
              this.portal = new TemplatePortal(this.dropdown.templateRef, this.viewContainerRef);
            }
            this.overlayRef.attach(this.portal);
            this.positionChanges$ = positionStrategy.positionChanges
              .subscribe((change) => {
                this.dropdown.dropDownPosition = change.connectionPair.originY;
              });
          } else if (this.overlayRef) {
            this.overlayRef.detach();
            this.overlayRef = null;
            this.overlay$.unsubscribe();
            this.positionChanges$.unsubscribe();
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.overlay$.unsubscribe();
    this.positionChanges$.unsubscribe();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { visible } = changes;
    if (this.dropdown) {
      if (visible) {
        this.dropdownVisible$.next(visible.currentValue);
      }
    }
  }

  get triggerWidth(): number {
    const triggerWidth = this.el.nativeElement.getBoundingClientRect().width;
    return this.minWidth <= triggerWidth ? triggerWidth : this.minWidth;
  }
}
