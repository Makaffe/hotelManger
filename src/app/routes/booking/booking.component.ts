import { Component, OnInit, ViewChild } from '@angular/core';
import { CacheService } from '@delon/cache';
import { _HttpClient } from '@delon/theme';

import { EChartsOption } from 'echarts';
import { NzMessageService } from 'ng-zorro-antd';
import { CommentDetailComponent } from '../UserComponent/userComment/comment-detail.component';
import { BookingDetailComponent } from './booking-detail.component';
import { BookingService } from './service/BookingService';
@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
})
export class BookingComponent implements OnInit {
  constructor(
    public http: _HttpClient,
    private bookingService: BookingService,
    private cacheService: CacheService,
    private msg: NzMessageService,
  ) {}
  @ViewChild('bookingDetail', { static: false })
  bookingDetailComponent: BookingDetailComponent;
  @ViewChild('commentDetail', { static: false })
  commentDetailComponent: CommentDetailComponent;

  // 判断身份登录
  role = this.cacheService.get('__user', { mode: 'none' }).userType;
  // 筛选用户数据
  userId = this.cacheService.get('__user', { mode: 'none' }).id;

  // 表格读取
  loading = false;

  listOfData = [];

  ngOnInit(): void {
    this.load();
  }
  showModal() {
    this.bookingDetailComponent.showModal();
  }

  load() {
    this.loading = true;
    this.bookingService.findAll().subscribe((data) => {
      if (this.role === 'User') {
        data = data.filter((row) => row.user_Id === this.userId);
      }
      this.listOfData = data;
      this.loading = false;
    });
  }

  endOrder(id: string) {
    this.bookingService.endOrder(id).subscribe((data) => {
      // tslint:disable-next-line:label-position
      // tslint:disable-next-line:no-unused-expression
      this.bookingDetailComponent.loadRoom();
      this.load();
      this.loading = false;
      this.msg.success(`订单结束`);
    });
  }

  addComment(data: any) {
    this.commentDetailComponent.addComment(data);
  }
}
