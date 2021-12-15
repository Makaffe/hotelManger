import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';

import { EChartsOption } from 'echarts';
import { BookingDetailComponent } from './booking-detail.component';
@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html',
})
export class BookingComponent implements OnInit {
    @ViewChild('bookingDetail', { static: false })
    bookingDetailComponent: BookingDetailComponent
    //判断身份登录
    role: string;
    ngOnInit(): void {
        this.http
            .get('/login/account?_allow_anonymous=true').subscribe(data => {
                if (data.userName !== 'admin') {
                    this.role = data.userName;
                } else {
                    this.role = "admin";
                }
            })
    }
    listOfData = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park'
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park'
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park'
        }
    ];
    constructor(public http: _HttpClient,) { }
    showModal() {
        this.bookingDetailComponent.showModal();
    }

}
