import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CacheService } from '@delon/cache';
import { _HttpClient } from '@delon/theme';
import { NzFormatEmitEvent, NzMessageService } from 'ng-zorro-antd';
import { UserService } from '../UserComponent/service/UserService';
import { RoleDetailComponent } from './role-detail.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
})
export class RoleComponent implements OnInit {
  @ViewChild('roleDetailComponent', { static: false })
  roleDetailComponent: RoleDetailComponent;

  // 获取用户角色
  userType = this.cacheService.get('__user', { mode: 'none' }).userType;

  // 身份数组
  listOfData = [];

  // 读取列表
  loading = false;

  constructor(
    public http: _HttpClient,
    private userService: UserService,
    private cacheService: CacheService,
    private router: Router,
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

  deleteUser(id: string) {
    this.userService.delete(id).subscribe((data) => {
      this.load();
      this.msg.success('删除用户成功');
    });
  }

  // 展示详情框
  showModal(isWatch?: boolean, data?: any) {
    this.roleDetailComponent.showModal(isWatch, data);
  }

  // 读取列表()
  load() {
    this.userService.findAll().subscribe((data) => {
      this.listOfData = data;
    });
  }
}
