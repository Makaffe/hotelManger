import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  constructor(private http: _HttpClient) {}

  /**
   * API请求URL
   */
  private static URL = 'http://localhost:8080/message';

  findAll(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${NotifyService.URL}/findAll`);
  }

  addMessage(dto?: any): Observable<any> {
    return this.http.post<any>(`${NotifyService.URL}/addMessage`, dto);
  }

  confirm(id: string): Observable<any> {
    return this.http.post<any>(`${NotifyService.URL}/confirm/${id}`);
  }
  del(id: string): Observable<any> {
    return this.http.post<any>(`${NotifyService.URL}/del/${id}`);
  }
  findByStatus(dto?: any): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${NotifyService.URL}/findAllByStatus`, dto);
  }
}
