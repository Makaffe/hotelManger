import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root',
})
export class UserRecommendService {
  /**
   * API请求URL
   */
  private static URL = 'http://localhost:8080/recommend';

  constructor(private http: _HttpClient) {}

  /**
   * 查询人员数据
   *
   */
  findAll(): Observable<Array<any>> {
    // const params = {};

    return this.http.get<Array<any>>(`${UserRecommendService.URL}/findRecommend`);
  }

  addRecommend(dto?: any): Observable<any> {
    return this.http.post<any>(`${UserRecommendService.URL}/add`, dto);
  }

  deleteRecommend(id: string): Observable<any> {
    return this.http.delete<any>(`${UserRecommendService.URL}/delete/${id}`);
  }
}
