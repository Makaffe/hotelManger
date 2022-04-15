import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { _HttpClient } from '@delon/theme';

import { EChartsOption } from 'echarts';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { RoomService } from '../room/service/RoomService';
import { UserService } from '../UserComponent/service/UserService';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  providers: [DatePipe],
})
export class RoleDetailComponent implements OnInit {
  /**
   * 表单组件
   */
  @ViewChild('form', { static: false })
  form: NgForm;

  /**
   * 发送通知
   */
  @Output()
  notification = new EventEmitter<any>();

  // 表单
  validateForm: FormGroup;

  // isWatch
  isWatch: boolean;

  // 是否可见
  isVisible = false;

  // ok读取
  isOkLoading = false;

  // 角色数组
  roles = [
    { name: '管理人员', value: 'Manager' },
    { name: '工作人员', value: 'Worker' },
    { name: '普通用户', value: 'User' },
  ];

  // 值
  values: any[] | null = null;

  // 用户数组
  users = [];

  // 预约订单初始化函数
  paramsItem = this.initRole();

  /**
   * 构建整改单位到人  map
   */
  organizationTreeMap: Map<string, string> = new Map<string, string>();

  showModal(isWatch?: boolean, item?: any): void {
    this.paramsItem = this.initRole(item);
    this.isWatch = isWatch;
    this.isVisible = true;
  }

  handleOk(): void {
    if (
      this.paramsItem.username === null ||
      this.paramsItem.password === null ||
      this.paramsItem.name === null ||
      this.paramsItem.identity === null ||
      this.paramsItem.phone === null ||
      this.paramsItem.userType === null
    ) {
      this.msg.error('请把带*号的信息填完');
      return;
    }
    if (!this.paramsItem.id) {
      this.userService.create(this.paramsItem).subscribe((data) => {
        this.notification.emit();
        this.msg.success('新增成功');
        this.handleCancel();
      });
    } else {
      this.userService.update(this.paramsItem.id, this.paramsItem).subscribe((data) => {
        this.notification.emit();
        this.msg.success('更新成功');
        this.handleCancel();
      });
    }
  }

  handleCancel(): void {
    this.form.reset('form');
    this.isVisible = false;
  }

  /**
   *
   * @param item 初始化订单函数
   * @returns 订单
   */
  initRole(item?: any): any {
    return {
      id: item ? item.id : null,
      username: item ? item.username : null,
      password: item ? item.password : null,
      identity: item ? item.identity : null,
      name: item ? item.name : null,
      phone: item ? item.phone : null,
      userType: item ? item.userType : null,
      bookingTime: item ? item.bookingTime : null,
      token: item ? item.token : null,
      del_flag: item ? item.del_flag : '0',
    };
  }

  constructor(private fb: FormBuilder, private userService: UserService, private msg: NzMessageService, private datepipe: DatePipe) {}
  ngOnInit(): void {}
}
