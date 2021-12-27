import {IconFlagPolish} from "../../../components/icons/icons/iconFlagPolish";
import {IconDefinition} from "../../../components/icons/icons.type";
import {IconFlagGerman} from "../../../components/icons/icons/iconFlagGerman";
import {IconFlagBulgarian} from "../../../components/icons/icons/iconFlagBulgarian";
import {IconFlagEnglish} from "../../../components/icons/icons/iconFlagEnglish";
import {IconFlagFrench} from "../../../components/icons/icons/iconFlagFrench";
import {IconFlagHindi} from "../../../components/icons/icons/iconFlagHindi";
import {IconFlagPersian} from "../../../components/icons/icons/iconFlagPersian";
import {IconFlagPortuguese} from "../../../components/icons/icons/iconFlagPortuguese";
import {IconFlagSpanish} from "../../../components/icons/icons/iconFlagSpanish";
import {IconFlagItalian} from "../../../components/icons/icons/iconFlagItalian";

export class Country {
  code: CountriesCode;
  name: string;
  icon: IconDefinition;

  constructor(item: Country) {
    this.code = item.code;
    this.name = item.name;
    this.icon = item.icon;
  }
}

export enum CountriesCode {
  en = 'en',
  de = 'de',
  fr = 'fr',
  it = 'it',
  es = 'es',
  pt = 'pt',
  hi = 'hi',
  pl = 'pl',
  fa = 'fa',
  bg = 'bg',
}

export const Countries: Country[] = [
  new Country({code: CountriesCode.en, name: 'Английский', icon: IconFlagEnglish}),
  new Country({code: CountriesCode.de, name: 'Немецкий', icon: IconFlagGerman}),
  new Country({code: CountriesCode.fr, name: 'Французский', icon: IconFlagFrench}),
  new Country({code: CountriesCode.it, name: 'Итальянский', icon: IconFlagItalian}),
  new Country({code: CountriesCode.es, name: 'Испанский', icon: IconFlagSpanish}),
  new Country({code: CountriesCode.pt, name: 'Португальский', icon: IconFlagPortuguese}),
  new Country({code: CountriesCode.hi, name: 'Хинди', icon: IconFlagHindi}),
  new Country({code: CountriesCode.pl, name: 'Польский', icon: IconFlagPolish}),
  new Country({code: CountriesCode.fa, name: 'Персидский', icon: IconFlagPersian}),
  new Country({code: CountriesCode.bg, name: 'Болгарский', icon: IconFlagBulgarian})
];

