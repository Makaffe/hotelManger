import { Component, OnInit, ViewChild } from '@angular/core';
import { CacheService } from '@delon/cache';
import { _HttpClient } from '@delon/theme';

import { EChartsOption } from 'echarts';
import { NzMessageService } from 'ng-zorro-antd';
import { RoomService } from '../room/service/RoomService';
import { UserService } from '../UserComponent/service/UserService';
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
    private userService: UserService,
    private roomService: RoomService,
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

  // 房间选择值
  roomOptions: any[] | null = null;

  // 用户列表
  users = [];

  /**
   *
   * 用户Map
   */
  userMap: Map<string, string> = new Map<string, string>();

  /**
   * 房间Map
   */
  roomMap: Map<string, string> = new Map<string, string>();

  // 房间Id
  room_Id: string;

  // 日期格式化
  dateFormat = 'yyyy-MM-dd';

  status = [
    {
      label: '进行中',
      value: 1,
    },
    {
      label: '已结束',
      value: 0,
    },
  ];

  /**
   * 构建整改单位到人  map
   */
  organizationTreeMap: Map<string, string> = new Map<string, string>();

  listOfData = [];

  /**
   * 查询
   */
  searchItem = this.searchInit();

  ngOnInit(): void {
    this.load();
    this.loadRoom();
    setTimeout(() => {
      this.loadUser();
    }, 500);
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

  /**
   * 点击级联房间
   */
  chooseRoom(values: any) {
    if (values && values[1]) {
      this.searchItem.room_Id = values[1];
    }
  }

  /**
   * 读取房间内容
   */
  loadRoom() {
    this.roomService.findAll().subscribe((data) => {
      let CascadeData = [];
      CascadeData = this.fomatCascadeData(data);
      this.roomOptions = CascadeData;
    });
  }
  /**
   * 格式成级联选择数据
   */
  fomatCascadeData(data?: Array<any>): Array<any> {
    data = data.filter((row) => row.id > 0 && row.del_flag !== '1');
    data = [...data];
    data.forEach((item) => {
      this.roomMap.set(item.id, item.hallName + '/' + item.roomName);
    });
    data.forEach((item) => {
      this.organizationTreeMap.set(item.id, item.roomName);
      item.value = item.id;
      item.label = item.roomName;
      item.children = item.children && item.children.length > 0 ? item.children : null;
      if (item && item.children && item.children.length > 0) {
        this.fomatCascadeData(item.children);
      } else if (!item.organizationType || !item.children || item.children.length === 0) {
        item.isLeaf = true;
      }
    });
    return [...data];
  }

  loadUser() {
    this.userService.findAll().subscribe((data) => {
      this.users = data.filter((row) => row.userType === 'User');
      data.forEach((item) => {
        this.userMap.set(item.id, item.name);
      });
    });
  }

  /**
   * 回显
   */
  converseUser(id: string) {
    return this.userMap.get(id);
  }
  converseRoom(id: string) {
    return this.roomMap.get(id);
  }

  /**
   * 查询参数
   */
  searchInit(item?: any) {
    return {
      room_Id: item ? item.room_id : null,
      user_Id: item ? item.user_id : null,
      status: item ? item.status : null,
    };
  }

  search() {
    if (this.role === 'User') {
      this.searchItem.user_Id = this.userId;
    }
    this.bookingService.findByQuery(this.searchItem).subscribe((data) => {
      this.listOfData = data;
      this.msg.success('查询成功');
    });
  }

  clear() {
    this.room_Id = '';
    this.searchItem = this.searchInit();
  }

  showDetail(data: any) {
    this.bookingDetailComponent.showModal(data, true);
  }
}
