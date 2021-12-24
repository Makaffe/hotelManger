import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/internal/Observable';
import { RoomDTO } from '../model/RoomDTO';
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
   * 查询所有房间
   */
  findAll(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${RoomService.URL}/findAll`);
  }

  /**
   * 创建房间
   * @param dto 房间dto
   */
  create(dto?: RoomDTO): Observable<RoomDTO> {
    return this.http.post<RoomDTO>(`${RoomService.URL}/add`, dto);
  }

  /**
   * 删除房间
   */
  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${RoomService.URL}/delete/${id}`);
  }

  /**
   * 不生成树形结构的房间查询
   */
  findAllByNotTree(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${RoomService.URL}/findAllByNotTree`);
  }
}
