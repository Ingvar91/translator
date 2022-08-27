import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, finalize, Subject, switchMap, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslatorService } from './services/translator.service';
import { Countries, CountriesCode, Country } from './models/translator.models';
import { IconChevronDown } from '../../components/icons/icons/iconChevronDown';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TranslatorService, FormBuilder],
})
export class TranslatorComponent implements OnInit, OnDestroy {
  originalText$ = new Subject<string>(); // сюда эмитим текст, который хотим перевести

  translateText$ = new BehaviorSubject<string>(''); // переведенный текст

  destroy$ = new Subject<void>();

  countries = Countries; // список стран для dropdown

  currentCountry?: Country; // текущий язык

  visibleDropdown = false; // свернут/развернут dropdown

  isLoading$ = new BehaviorSubject<boolean>(false); // статус загрузки перевода от сервера

  tooltipTitle: string = 'Копировать'; // текст для tooltip-а кнопки копировать

  maxLengthInputText = 300; // максимальное количество символов в текстовом поле

  formGroup: FormGroup;

  iconChevronDown = IconChevronDown; // иконка для выпадающего списка выбора языка

  constructor(public translatorService: TranslatorService, private cdr: ChangeDetectorRef, private fb: FormBuilder) {
    // по дефолту английский
    this.currentCountry = this.countries.find((f) => f.code === CountriesCode.en);
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      text: [null, [Validators.required]],
    });

    this.originalText$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((text: string) => {
          this.isLoading$.next(true);
          return this.translatorService
            .translate(text, this.currentCountry?.code || CountriesCode.en)
            .pipe(finalize(() => this.isLoading$.next(false)));
        }),
      )
      .subscribe((text) => {
        this.translateText$.next(text);
      });
  }

  // выбрать страну, закрыть dropdown,
  // а так же если есть исходный текст и переведенный, то делаем запрос для перевода на новый язык
  selectCountry(country: Country): void {
    this.currentCountry = country;
    this.visibleDropdown = false;
    if (this.formGroup.value.text && this.translateText$.getValue()) {
      this.originalText$.next(this.formGroup.value.text);
    }
  }

  // перевести текст
  onTranslate(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      return;
    }
    this.originalText$.next(this.formGroup.value.text);
  }

  // вставить из буфера текст (нужно разрешить в браузере это действие)
  onPaste(): void {
    navigator.clipboard.readText().then((text: string) => {
      text = String(text)?.substring(0, this.maxLengthInputText) || '';
      if (text?.length) {
        this.formGroup.setValue({
          text,
        });
        this.cdr.markForCheck();
      }
    });
  }

  // очистить текст в форме
  onClear(): void {
    this.formGroup.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
