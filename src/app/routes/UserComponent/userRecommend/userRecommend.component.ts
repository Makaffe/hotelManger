import { Component, OnInit, ViewChild } from '@angular/core';
import { CacheService } from '@delon/cache';
import { NzMessageService } from 'ng-zorro-antd';
import { BookingDetailComponent } from '../../booking/booking-detail.component';
import { RoomService } from '../../room/service/RoomService';
import { UserRecommendService } from '../service/UserRecommend';

@Component({
  selector: 'app-userRecommend',
  templateUrl: './userRecommend.component.html',
})
export class UserRecommendComponent implements OnInit {
  @ViewChild('bookingDetail', { static: false })
  bookingDetailComponent: BookingDetailComponent;
  // 初始化参数
  paramsItem = this.initParams();

  // 推荐房间
  roomRecommend = [];

  // 剩余房间
  roomSurplus = [];

  // 筛选用户数据
  userId = this.cacheService.get('__user', { mode: 'none' }).id;

  constructor(
    private userRecommendService: UserRecommendService,
    private roomService: RoomService,
    private cacheService: CacheService,
    private msg: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.load();
  }
  loadSurplus() {
    this.roomSurplus = [];
    this.roomService.findAllByNotTree().subscribe((data) => {
      this.roomSurplus = data.filter((row) => row.status === true && row.parent_Id !== null);
    });
  }

  loadRecommend() {
    this.roomRecommend = [];
    this.userRecommendService.findAll().subscribe((data) => {
      const listData1 = data;

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < listData1.length; i++) {
        if (listData1[i][1] !== this.userId) {
          continue;
        }
        const totalData = {
          recommendId: listData1[i][0],
          room_Id: listData1[i][2],
          user_Id: this.userId,
          Title: listData1[i][4] + '/' + listData1[i][3],
          img: listData1[i][5],
          nzDescription: '￥' + listData1[i][6] + '/一天',
        };
        this.roomRecommend.push(totalData);
      }
    });
  }
  initParams(item?: any) {
    return {
      id: item ? item.id : null,
      user_Id: item ? item.user_Id : null,
      room_Id: item ? item.room_Id : null,
    };
  }

  /**
   * 加入喜爱
   */
  addRecommend(room_Id: string) {
    this.paramsItem.room_Id = room_Id;
    this.paramsItem.user_Id = this.userId;
    this.userRecommendService.addRecommend(this.paramsItem).subscribe((data) => {
      this.msg.success('添加成功');
      this.load();
    });
  }

  dislike(recommend_Id: string) {
    this.userRecommendService.deleteRecommend(recommend_Id).subscribe((data) => {
      this.msg.success('删除成功');
      this.load();
    });
  }

  bookingRecommendRoom(item: any) {
    console.log(item);
    this.bookingDetailComponent.showModal(item);
  }

  bookingSurplusRoom(item: any) {
    console.log(item);
    item.user_Id = this.userId;
    item.room_Id = item.id;
    this.bookingDetailComponent.showModal(item);
  }

  load() {
    this.loadRecommend();
    this.loadSurplus();
  }
}
