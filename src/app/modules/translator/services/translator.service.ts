import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { CountriesCode } from '../models/translator.models';
import { environment } from '../../../../environments/environment';

@Injectable()
export class TranslatorService {
  apiUrl = `${environment.apiProtocol}://${environment.apiHost}/`;

  headers = {
    'content-type': 'application/json',
    'x-rapidapi-host': `${environment.apiHost}`,
    'x-rapidapi-key': `${environment.xRapidapiKey}`,
  };

  constructor(
    public http: HttpClient,
  ) {}

  translate(text: string, to: CountriesCode): Observable<string> {
    text = text?.trim();
    if (text?.length < 2) { // если длина строки меньше 2-х символов, возвращаем пустую строку
      return of('');
    }

    let params = new HttpParams();
    params = params.append('to', to)
      .append('api-version', '3.0')
      .append('profanityAction', 'NoAction')
      .append('textType', 'plain');

    return this.http.post<{ translations: { text: string }[] }[]>(
      `${this.apiUrl}/translate`,
      [{ Text: text }],
      { headers: this.headers, params, withCredentials: true },
    ).pipe(map((trs) => trs[0]?.translations[0]?.text || ''));
  }
}
