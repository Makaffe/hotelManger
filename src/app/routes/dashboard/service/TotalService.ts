import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root',
})
export class TotalService {
  /**
   * API请求URL
   */
  private static URL = 'http://localhost:8080/total';

  constructor(private http: _HttpClient) {}

  findMoneyByRoom(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${TotalService.URL}/findMoneyByRoom`);
  }

  findLikeByRoom(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${TotalService.URL}/findLikeByRoom`);
  }
}
