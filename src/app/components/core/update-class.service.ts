import { Injectable, Renderer2 } from '@angular/core';

@Injectable()
export class UpdateClassService {
  constructor(private renderer: Renderer2) {}

  updateHostClass(el: HTMLElement, classArray: string[]): void {
    this.addClass(el, classArray, this.renderer);
  }

  private addClass(el: HTMLElement, classArray: string[], renderer: Renderer2): void {
    (classArray || []).forEach((className) => {
      renderer.addClass(el, className);
    });
  }
}
