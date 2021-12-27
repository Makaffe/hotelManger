import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/internal/Observable';
import { BookingDTO } from '../model/BookingDTO';
@Injectable({
  providedIn: 'root',
})
export class BookingService {
  /**
   * API请求URL
   */
  private static URL = 'http://localhost:8080/order';

  constructor(private http: _HttpClient) {}

  /**
   * 创建订单
   * @param dto 订单dto
   *
   */
  create(dto?: BookingDTO): Observable<BookingDTO> {
    return this.http.post<BookingDTO>(`${BookingService.URL}/startOrder`, dto);
  }

  /**
   * 结束订单
   * @param id ID
   *
   */
  endOrder(id: string): Observable<any> {
    return this.http.post<any>(`${BookingService.URL}/endOrder/${id}`);
  }

  /**
   * 查询所有审计报告数据
   *
   */
  findAll(): Observable<Array<BookingDTO>> {
    // const params = {};

    return this.http.get<Array<BookingDTO>>(`${BookingService.URL}/findAll`);
  }

  /**
   * 分页查询审计报告数据
   * @param sort 排序字段, 例如：字段1,asc,字段2,desc
   * @param page 页号，从0开始
   * @param size 每页纪录条数
   * @param type 报告类型
   * @param name 报告名称
   * @param auditBeginTime 审计开始日期(yyyy-MM-dd)
   * @param auditEndTime 审计结束日期(yyyy-MM-dd)
   * @param auditUnitName 审计单位名称
   *
   */
  //   findOnePage(
  //     option: QueryOptions,
  //     type?: string,
  //     name?: string,
  //     auditBeginTime?: string,
  //     auditEndTime?: string,
  //     auditUnitName?: string,
  //   ): Observable<PageDataDTO<BookingDTO>> {
  //     const params = {};
  //     Object.assign(params, option);
  //     Object.assign(params, type ? { type } : {});
  //     Object.assign(params, name ? { name } : {});
  //     Object.assign(params, auditBeginTime ? { auditBeginTime } : {});
  //     Object.assign(params, auditEndTime ? { auditEndTime } : {});
  //     Object.assign(params, auditUnitName ? { auditUnitName } : {});

  //     return this.http.get<PageDataDTO<BookingDTO>>(`${BookingService.URL}/findOnePage`, params);
  //   }

  /**
   * 更新审计报告数据
   * @param id 审计报告ID
   * @param dto 审计报告DTO
   *
   */
  //   update(id: string, dto?: BookingDTO): Observable<BookingDTO> {
  //     return this.http.put<BookingDTO>(`${BookingService.URL}/update/${id}`, dto);
  //   }

  /**
   * 根据ID查询审计报告数据
   * @param id 审计报告ID
   *
   */
  findById(id: string): Observable<BookingDTO> {
    return this.http.get<BookingDTO>(`${BookingService.URL}/${id}`);
  }

  findByQuery(dto?: any): Observable<any> {
    return this.http.post<any>(`${BookingService.URL}/findByQuery`, dto);
  }
}
