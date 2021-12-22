import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root',
})
export class UserCommentService {
  /**
   * API请求URL
   */
  private static URL = 'http://localhost:8080/comment';

  constructor(private http: _HttpClient) {}

  /**
   * 查询评价数据
   *
   */
  findAll(): Observable<Array<any>> {
    // const params = {};

    return this.http.post<Array<any>>(`${UserCommentService.URL}/searchAll`);
  }

  /**
   * 创建评论
   * @param dto 评论dto
   */
  create(dto?: any): Observable<any> {
    return this.http.post<any>(`${UserCommentService.URL}/add`, dto);
  }
}
