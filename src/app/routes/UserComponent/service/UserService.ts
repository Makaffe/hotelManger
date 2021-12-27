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
   * 查询人员数据
   *
   */
  findAll(): Observable<Array<any>> {
    // const params = {};

    return this.http.get<Array<any>>(`${UserService.URL}/all`);
  }

  findUserById(userId: any) {}

  loginCheck(dto?: any): Observable<any> {
    return this.http.post<any>(`${UserService.URL}/login?_allow_anonymous=true`, dto);
  }

  registry(dto?: any): Observable<any> {
    return this.http.post<any>(`${UserService.URL}/add?_allow_anonymous=true`, dto);
  }

  create(dto?: any): Observable<any> {
    return this.http.post<any>(`${UserService.URL}/add`, dto);
  }

  update(id: string, dto?: any): Observable<any> {
    return this.http.post<any>(`${UserService.URL}/update/${id}`, dto);
  }

  delete(id?: string): Observable<any> {
    return this.http.delete<any>(`${UserService.URL}/delete/${id}`);
  }
}
