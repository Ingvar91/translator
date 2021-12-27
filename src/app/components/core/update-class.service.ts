import { Injectable, Renderer2 } from '@angular/core';

@Injectable()
export class UpdateClassService {
  constructor(private renderer: Renderer2) {}
  private classMap = {};

  updateHostClass(el: HTMLElement, classMap: object): void {
    this.classMap = { ...classMap };
    this.addClass(el, this.classMap, this.renderer);
  }

  private addClass(el: HTMLElement, classMap: {[val: string]: string}, renderer: Renderer2): void {
    for (const i in classMap) {
      if (classMap.hasOwnProperty(i)) {
        if (classMap[i]) {
          renderer.addClass(el, i);
        }
      }
    }
  }

}
