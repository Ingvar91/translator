export enum IconDefinitionFillRule {
  evenodd = 'evenodd',
  nonzero = 'nonzero',
}

export interface IconDefinition {
  name: string;
  height: number;
  width: number;
  svgData?: string; // значение path svg файла, может быть либо svgData либо svgFileName
  svgFileName?: string; // имя файла в assets
  fillRule?: IconDefinitionFillRule;
}

export interface PropertiesSvg {
  xmlns: string;
  role: string;
  'aria-hidden': boolean;
  fill: string;
  viewBox: string;
  width: string;
  height: string;
}

export interface CachedIconDefinition {
  name: string;
  theme: string;
  icon: SVGElement;
}
