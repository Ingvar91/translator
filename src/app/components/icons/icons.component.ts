import {IconDefinition, PropertiesSvg} from './icons.type';
import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {take} from "rxjs";

@Component({
  selector: 'app-icon',
  template: '',
  styleUrls: ['./icons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {

  _icon: IconDefinition;
  _fontSize = 1; // размер иконки (по умолчанию 1), ед. измерения rem

  properties: PropertiesSvg = {
    xmlns: 'http://www.w3.org/2000/svg',
    role: 'img',
    'aria-hidden': true,
    fill: 'currentColor',
    viewBox: '0 0 16 16',
    width: '1em',
    height: '1em'
  };

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    public http: HttpClient,
    public sanitizer: DomSanitizer,
  ) { }

  @Input()
  set icon(icon: IconDefinition) {
    if (this.icon?.name !== icon.name) {
      if (this._icon) {
        // удаляем уже имеющиеся svg элементы
        Array.from(this.el.nativeElement.children).forEach((child) => {
          this.renderer.removeChild(this.el.nativeElement, child);
        });
      }
      this._icon = icon;
      this.getSvgAndSetProperties();
    }
  }

  get icon(): IconDefinition {
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

  // добавить svg файл в компонент
  renderIcon(svg: SVGElement): void {
    const fragment = document.createRange().createContextualFragment(svg.outerHTML);
    // добавляем svg в текущий компонент
    this.renderer.appendChild(this.el.nativeElement, fragment);
  }

  // создать/получить svg файл и задать ему свойства
  getSvgAndSetProperties(): void {
    if (this.icon.svgFileName) {
      // получить файл из папки assets в виде строки
      this.http.get(`assets/svg/${this.icon.svgFileName}`,{ responseType: 'text' })
        .pipe(take(1))
        .subscribe((res) => {
          const safeHtml: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(res);
          if (safeHtml) {
            // создать фрагмент html с svg кодом
            const svg = document.createRange().createContextualFragment(safeHtml as string).firstElementChild!;
            // получить атрибут viewBox что бы узнать высоту и ширину svg
            const viewBoxArray = String(svg.getAttribute('viewBox')).split(  ' ');
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
            this.renderIcon(svg as SVGElement);
          }
        });
    } else if (this.icon.svgData) {
      // создаем svg файл
      const svg: SVGElement = this.renderer.createElement('svg');
      // устанавливаем свойства
      for (const prop of Object.keys(this.properties)) {
        if (prop === 'viewBox') {
          this.properties[prop] = `0 0 ${this.icon.width} ${this.icon.height}`;
        }
        if (prop === 'width' && this.icon.width > this.icon.height) {
          this.properties.width = `${this.icon.width / this.icon.height}em`;
        }
        if (prop === 'height' && this.icon.height > this.icon.width) {
          this.properties.width = `${this.icon.height / this.icon.width}em`;
        }
        // @ts-ignore
        this.renderer.setAttribute(svg, prop, this.properties[prop]);
      }
      if (this.icon.fillRule) {
        this.renderer.setAttribute(svg, 'fill-rule', this.icon.fillRule);
      }
      // создаем тег path
      const path = this.renderer.createElement('path');
      // устанавливаем значение для тега path
      this.renderer.setAttribute(path, 'd', this.icon.svgData);
      // добавляем тег path в ранее созданный тег svg
      this.renderer.appendChild(svg, path);
      this.renderIcon(svg as SVGElement);
    }
  }

}
