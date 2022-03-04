import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CacheService } from '@delon/cache';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RoomService } from '../../room/service/RoomService';
import { UserCommentDTO } from '../model/UserCommentDTO';
import { UserCommentService } from '../service/UserCommentService';
import { UserService } from '../service/UserService';
import { CommentDetailComponent } from './comment-detail.component';

@Component({
  selector: 'app-user-Comment',
  templateUrl: './userComment.component.html',
})
// tslint:disable-next-line:class-name
export class userCommentComponent implements OnInit {
  @ViewChild('commentDetail', { static: false })
  commentDetailComponent: CommentDetailComponent;
  listData = [];

  // 获取用户身份
  userType = this.cacheService.get('__user', { mode: 'none' }).userType;

  userId = this.cacheService.get('__user', { mode: 'none' }).id;

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

  delete(id: string) {}

  businessReply(item: any) {
    this.commentDetailComponent.addComment(item);
  }

  constructor(
    private userCommentService: UserCommentService,
    private msg: NzMessageService,
    private cacheService: CacheService,
    private userService: UserService,
    private roomService: RoomService,
  ) {}
  ngOnInit(): void {
    this.loadData();
    this.loadUser();
    this.loadRoom();
  }

  loadData(): void {
    if (this.userType === 'User') {
      this.userCommentService.findAll().subscribe((data) => {
        this.listData = data.filter((row) => row.user_Id === this.userId);
        this.listData.forEach((item) => {
          this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
        });

        // this.msg.success('读取成功');
      });
    } else {
      this.userCommentService.findAll().subscribe((data) => {
        this.listData = data;
        this.listData.forEach((item) => {
          this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
        });

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
