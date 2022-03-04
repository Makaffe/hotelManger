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

  // /**
  //  *
  //  * @param dto 根据查询条件查数据
  //  * @returns
  //  */
  findByRoomId(dto?: any): Observable<Array<any>> {
    return this.http.post<Array<any>>(`${UserCommentService.URL}/search`, dto);
  }

  /**
   * 创建评论
   * @param dto 评论dto
   */
  create(dto?: any): Observable<any> {
    return this.http.post<any>(`${UserCommentService.URL}/add`, dto);
  }
}
