import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';

import { EChartsOption } from 'echarts';
import { NzMessageService } from 'ng-zorro-antd';
import { BookingDetailComponent } from './booking-detail.component';
import { BookingService } from './service/BookingService';
@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
})
export class BookingComponent implements OnInit {
  constructor(public http: _HttpClient, private bookingService: BookingService, private msg: NzMessageService) {}
  @ViewChild('bookingDetail', { static: false })
  bookingDetailComponent: BookingDetailComponent;
  // 判断身份登录
  role: string;

  // 表格读取
  loading = false;
  listOfData = [];
  ngOnInit(): void {
    this.http.get('/login/account?_allow_anonymous=true').subscribe((data) => {
      if (data.userName !== 'admin') {
        this.role = data.userName;
      } else {
        this.role = 'admin';
      }
    });

    this.load();
  }
  showModal() {
    this.bookingDetailComponent.showModal();
  }

  load() {
    this.loading = true;
    this.bookingService.findAll().subscribe((data) => {
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
}
