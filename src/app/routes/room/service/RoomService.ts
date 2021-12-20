import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: _HttpClient) {}

  /**
   * API请求URL
   */
  private static URL = 'http://localhost:8080/room';

  /**
   * 查询所有审计报告数据
   *
   */
  findAll(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${RoomService.URL}/findAll`);
  }
}
