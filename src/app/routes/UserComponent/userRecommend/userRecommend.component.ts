import { Component, OnInit } from '@angular/core';
import { CacheService } from '@delon/cache';
import { RoomService } from '../../room/service/RoomService';
import { UserRecommendService } from '../service/UserRecommend';

@Component({
  selector: 'app-userRecommend',
  templateUrl: './userRecommend.component.html',
})
export class UserRecommendComponent implements OnInit {
  // 推荐房间
  roomRecommend = [];

  // 剩余房间
  roomSurplus = [];

  // 筛选用户数据
  userId = this.cacheService.get('__user', { mode: 'none' }).id;

  constructor(private userRecommendService: UserRecommendService, private roomService: RoomService, private cacheService: CacheService) {}

  ngOnInit(): void {
    this.loadRecommend();
    this.loadSurplus();
  }
  loadSurplus() {
    this.roomService.findAllByNotTree().subscribe((data) => {
      this.roomSurplus = data.filter((row) => row.status === true && row.parent_Id !== null);
    });
  }

  loadRecommend() {
    this.userRecommendService.findAll().subscribe((data) => {
      const listData1 = data;

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < listData1.length; i++) {
        if (listData1[i][1] !== this.userId) {
          continue;
        }
        const totalData = {
          Title: listData1[i][4] + '/' + listData1[i][3],
          img: listData1[i][5],
          nzDescription: '￥' + listData1[i][6] + '/一天',
        };
        this.roomRecommend.push(totalData);
      }
    });

    console.log(this.roomRecommend);
  }
}
