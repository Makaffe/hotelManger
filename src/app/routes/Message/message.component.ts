import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CacheService } from '@delon/cache';
import { _HttpClient } from '@delon/theme';
import { NzFormatEmitEvent, NzMessageService } from 'ng-zorro-antd';
import { NotifyService } from 'src/app/layout/default/header/components/Service/NotifyService';
import { UserService } from '../UserComponent/service/UserService';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
})
export class MessageComponent implements OnInit {
  /**
   *
   * 用户Map
   */
  userMap: Map<string, string> = new Map<string, string>();

  // 获取用户角色
  userType = this.cacheService.get('__user', { mode: 'none' }).userType;

  // 身份数组
  listOfData = [];

  // 读取列表
  loading = false;

  // 消息参数
  messageItem = this.messageInit();

  // 查询
  searchItem = this.searchInit();

  // 弹窗可见
  isVisible = false;

  // userId
  userId = '';

  // 状态
  status: string;

  statusOption = [
    { name: '已完成', value: 'Finish' },
    { name: '未完成', value: 'Waiting' },
  ];

  messageInit(item?: any) {
    return {
      user_Id: item ? item.user_id : null,
      content: item ? item.content : null,
      del_flag: item ? item.del_flag : null,
      status: item ? item.status : null,
    };
  }

  searchInit(item?: any) {
    return {
      status: item ? item.status : null,
    };
  }

  load() {
    this.loadUser();
    this.notifyService.findAll().subscribe((data) => {
      this.listOfData = data;
    });
  }

  finish(id?: string) {
    this.notifyService.confirm(id).subscribe((data) => {
      this.load();
    });
  }
  del(id?: string) {
    this.notifyService.del(id).subscribe((data) => {
      this.load();
    });
  }

  showModal(item?: any) {
    this.messageItem = this.messageInit(item);
    this.userId = item.user_Id;
    this.isVisible = true;
  }

  search() {
    // this.msg.info(this.searchItem.status);
    this.notifyService.findByStatus(this.searchItem).subscribe((data) => {
      this.listOfData = data;
    });
  }

  handleCancel() {
    this.isVisible = false;
  }
  loadUser() {
    this.userService.findAll().subscribe((data) => {
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

  constructor(
    public http: _HttpClient,
    private userService: UserService,
    private cacheService: CacheService,
    private router: Router,
    private notifyService: NotifyService,
    private msg: NzMessageService,
  ) {}
  ngOnInit(): void {
    if (this.userType === 'User') {
      this.msg.error('您没有权限登录,请重新登陆');
      this.cacheService.clear();
      this.router.navigateByUrl('/passport/login');
    }
    this.load();
  }
}
