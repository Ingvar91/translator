import { ChangeDetectionStrategy, Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-icon',
  template: '',
  styleUrls: ['./icons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  _icon: string;

  _fontSize = 1; // Размер иконки (по умолчанию 1), ед. измерения rem

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    public http: HttpClient,
    public sanitizer: DomSanitizer,
  ) {}

  @Input()
  set icon(icon: string | undefined | null) {
    if (this.icon !== icon && icon) {
      if (this._icon) {
        // удаляем уже имеющиеся svg элементы
        Array.from(this.el.nativeElement.children).forEach((child) => {
          this.renderer.removeChild(this.el.nativeElement, child);
        });
      }
      this._icon = icon;
      this.createSvg(icon);
    }
  }

  get icon(): string {
    return this._icon;
  }

  @Input()
  set fontSize(fontSize: number) {
    this._fontSize = fontSize;
    this.renderer.setStyle(this.el.nativeElement, 'font-size', `${this.fontSize}rem`);
  }

  get fontSize(): number {
    return this._fontSize;
  }

  createSvg(svgString: string) {
    const safeHtml: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(svgString);
    if (safeHtml) {
      // создать фрагмент html с svg кодом
      const svg = document.createRange().createContextualFragment(safeHtml as string).firstElementChild!;

      // получить атрибут viewBox что бы узнать высоту и ширину svg
      const viewBoxArray = String(svg.getAttribute('viewBox')).split(' ');
      const width = Number(viewBoxArray[2]);
      const height = Number(viewBoxArray[3]);

      let widthSvg = '1em';
      if (width > height) {
        // ширина больше высоты, высчитываем соотношение ширины к высоте
        widthSvg = `${width / height}em`;
      }
      this.renderer.setAttribute(svg, 'width', widthSvg);

      let heightSvg = '1em';
      if (height > width) {
        // высота больше ширины, высчитываем соотношение высоты к ширине
        heightSvg = `${height / width}em`;
      }
      this.renderer.setAttribute(svg, 'height', heightSvg);
      this.renderer.setAttribute(svg, 'fill', 'currentColor');
      this.renderIcon(svg as SVGElement);
    }
  }

  // добавить svg файл в компонент
  renderIcon(svg: SVGElement): void {
    const fragment = document.createRange().createContextualFragment(svg.outerHTML);
    // добавляем svg в текущий компонент
    this.renderer.appendChild(this.el.nativeElement, fragment);
  }
}
