import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * API请求URL
   */
  private static URL = 'http://localhost:8080/user';

  constructor(private http: _HttpClient) {}

  /**
   * 查询所有审计报告数据
   *
   */
  findAll(): Observable<Array<any>> {
    // const params = {};

    return this.http.get<Array<any>>(`${UserService.URL}/all`);
  }
}
