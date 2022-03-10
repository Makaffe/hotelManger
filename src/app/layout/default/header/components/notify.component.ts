import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NoticeIconList, NoticeIconSelect, NoticeItem } from '@delon/abc/notice-icon';
import { CacheService } from '@delon/cache';
import add from 'date-fns/add';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parse from 'date-fns/parse';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RoomService } from 'src/app/routes/room/service/RoomService';
import { UserService } from 'src/app/routes/UserComponent/service/UserService';
import { NotifyService } from './Service/NotifyService';

@Component({
  selector: 'header-notify',
  template: `
    <notice-icon
      [data]="data"
      [count]="count"
      [loading]="loading"
      btnClass="alain-default__nav-item"
      btnIconClass="alain-default__nav-item-icon"
      (select)="select($event)"
      (clear)="clear($event)"
      (popoverVisibleChange)="loadData()"
    ></notice-icon>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNotifyComponent {
  /**
   *
   * 用户Map
   */
  userMap: Map<string, string> = new Map<string, string>();

  /**
   * 房间Map
   */
  roomMap: Map<string, string> = new Map<string, string>();

  data: NoticeItem[] = [
    {
      title: '完成',
      list: [],
      emptyText: '你没有已完成的工作',
      emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
      clearText: '清空完成',
    },
    {
      title: '待办',
      list: [],
      emptyText: '你已完成所有待办',
      emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg',
      clearText: '清空待办',
    },
    // {
    //   title: '待办',
    //   list: [],
    //   emptyText: '你已完成所有待办',
    //   emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg',
    //   clearText: '清空待办',
    // },
  ];
  count = 2;
  loading = false;

  // 筛选用户数据
  userId = this.cacheService.get('__user', { mode: 'none' }).id;

  constructor(
    private msg: NzMessageService,
    private nzI18n: NzI18nService,
    private cdr: ChangeDetectorRef,
    private cacheService: CacheService,
    private notifyService: NotifyService,
    private userService: UserService,
    private roomService: RoomService,
  ) {}

  private updateNoticeData(notices: NoticeIconList[]): NoticeItem[] {
    const data = this.data.slice();
    data.forEach((i) => (i.list = []));

    notices.forEach((item) => {
      const newItem = { ...item };
      if (typeof newItem.datetime === 'string') {
        newItem.datetime = parse(newItem.datetime, 'yyyy-MM-dd', new Date());
      }
      if (newItem.datetime) {
        newItem.datetime = formatDistanceToNow(newItem.datetime as Date, { locale: this.nzI18n.getDateLocale() });
      }
      if (newItem.extra && newItem.status) {
        newItem.color = (
          {
            todo: undefined,
            processing: 'blue',
            urgent: 'red',
            doing: 'gold',
          } as { [key: string]: string | undefined }
        )[newItem.status];
      }
      data.find((w) => w.title === newItem.type).list.push(newItem);
    });
    return data;
  }

  loadData(): void {
    this.loadUser();
    // this.loadRoom();

    if (this.loading) {
      return;
    }
    this.loading = true;
    setTimeout(() => {
      let list = [];
      const now = new Date();
      // this.data = this.updateNoticeData([

      //   {
      //     id: '000000008',
      //     avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
      //     title: '标题',
      //     description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
      //     datetime: '2017-08-07',
      //     type: '完成',
      //   },

      //   {
      //     id: '000000012',
      //     title: 'ABCD 版本发布',
      //     description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
      //     extra: '进行中',
      //     status: 'processing',
      //     type: '待办',
      //   },
      // ]);
      this.notifyService.findAll().subscribe((data) => {
        data = data.filter((row) => row.user_Id === this.userId);
        data.forEach((element) => {
          if (element.status === 'Finish') {
            element.type = '完成';
            element.extra = '已完成';
            element.status = 'processing';
          } else {
            element.type = '待办';
            element.extra = '进行中';
            element.status = 'doing';
          }
          list.push({
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
            id: element.id,
            title: element.content,
            description: '用户：' + this.converseUser(element.user_Id),
            type: element.type,
            status: element.status,
            extra: element.extra,

            // id: '000000012',
            // title: 'ABCD 版本发布',
            // description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
            // extra: '进行中',
            // status: 'processing',
            // type: '待办',
          });
        });
        this.data = this.updateNoticeData(list);
        this.count = list.length;
      });

      this.loading = false;
      // this.cdr.detectChanges();
    });
  }

  clear(type: string): void {
    this.msg.success(`清空了 ${type}`);
  }

  select(res: NoticeIconSelect): void {
    this.msg.success(`点击了 ${res.title} 的 ${res.item.title}`);
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
   * 读取角色信息
   */
  loadUser() {
    this.userService.findAll().subscribe((data) => {
      data.forEach((item) => {
        this.userMap.set(item.id, item.name);
      });
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
