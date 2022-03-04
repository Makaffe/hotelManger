import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CacheService } from '@delon/cache';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { BookingDetailComponent } from '../../booking/booking-detail.component';
import { RoomDTO } from '../../room/model/RoomDTO';
import { RoomService } from '../../room/service/RoomService';
import { UserCommentService } from '../service/UserCommentService';
import { UserRecommendService } from '../service/UserRecommend';
import { UserService } from '../service/UserService';
import { userCommentComponent } from '../userComment/userComment.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-recommendDetail',
  templateUrl: './recommendDetail.component.html',
})
export class RecommendDetailComponent implements OnInit {
  report$: Observable<any>;
  navigationSubscription;

  @ViewChild('roomComment', { static: false })
  roomComment: userCommentComponent;

  // 数据
  listData = [];

  // 房间Id
  roomId = '';

  roomItem = this.initRoom();

  // 树形表格
  mapOfExpandedData: { [id: string]: any[] } = {};

  /**
   *
   * 用户Map
   */
  userMap: Map<string, string> = new Map<string, string>();

  /**
   * 房间Map
   */
  roomMap: Map<string, string> = new Map<string, string>();
  // 初始化评论函数
  paramsItem = this.initSearch();
  initSearch(item?: any): any {
    return {
      room_Id: item ? item.room_Id : null,
      user_Id: item ? item.user_Id : null,
      order_Id: item ? item.order_Id : null,
    };
  }

  loadComment(roomId?: string) {
    if (roomId != null && roomId) {
      this.listData = this.listData.filter((row) => row.room_Id === roomId);
      this.listData = [...this.listData];
    }
  }

  ngOnInit(): void {
    // this.loadData();
    // this.loadUser();
    // this.loadRoom();
    // this.msg.success(this.roomId);
    this.activatedRoute.queryParams.subscribe((data) => {
      this.roomId = data.roomId;
    });
    if (this.roomId !== null && this.roomId !== '') {
      this.read();
    }
  }
  constructor(
    private userCommentService: UserCommentService,
    private userRecommendService: UserRecommendService,
    private roomService: RoomService,
    private cacheService: CacheService,
    private msg: NzMessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
  ) {
    this.navigationSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.roomId = event.url.substring(17);
      }
    });
  }

  read() {
    this.loadUser();
    this.loadRoom();
    this.loadRoomDetail();
    this.loadData(this.roomId);
  }

  /**
   * 下部分评论
   */

  collapse(array: any[], data: any, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach((d) => {
          // tslint:disable-next-line:no-non-null-assertion
          const target = array.find((a) => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: any): any[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      // tslint:disable-next-line:no-non-null-assertion
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          // tslint:disable-next-line:no-non-null-assertion
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: any, hashMap: { [id: string]: boolean }, array: any[]): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  loadData(roomId?: string): void {
    if (roomId !== null) {
      this.paramsItem.room_Id = roomId;
      this.userCommentService.findByRoomId(this.paramsItem).subscribe((data) => {
        this.listData = data;
        this.listData.forEach((item) => {
          this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
        });
        this.listData = [...this.listData];

        // this.msg.success('读取成功');
      });
    }
  }

  loadUser() {
    this.userService.findAll().subscribe((data) => {
      data.forEach((item) => {
        this.userMap.set(item.id, item.name);
      });
    });
  }

  // 预约订单初始化函数
  initRoom(item?: RoomDTO): RoomDTO {
    return {
      id: item ? item.id : null,
      roomName: item ? item.roomName : null,
      hallName: item ? item.hallName : null,
      description: item ? item.description : null,
      price: item ? item.price : null,
      parent_Id: item ? item.parent_Id : null,
      status: item ? item.status : null,
      chidren: item ? item.chidren : [],
      image: item ? item.image : null,
    };
  }

  /**
   * 查询房间详情
   */
  loadRoomDetail() {
    this.roomService.findById(this.roomId).subscribe((data) => {
      this.roomItem = this.initRoom(data);
    });
  }

  /**
   * 读取房间内容
   */
  loadRoom() {
    this.roomService.findAll().subscribe((data) => {
      let CascadeData = [];
      CascadeData = this.fomatCascadeData(data);
    });
  }
  /**
   * 格式成级联选择数据
   */
  fomatCascadeData(data?: Array<any>): Array<any> {
    data = data.filter((row) => row.id > 0);
    data = [...data];
    data.forEach((item) => {
      this.roomMap.set(item.id, item.hallName + '/' + item.roomName);
    });
    data.forEach((item) => {
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

  /**
   * 回显
   */
  converseUser(id: string) {
    return this.userMap.get(id);
  }
  converseRoom(id: string) {
    return this.roomMap.get(id);
  }
}
