import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { _HttpClient } from '@delon/theme';

import { EChartsOption } from 'echarts';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { RoomService } from '../room/service/RoomService';
import { UserService } from '../UserComponent/service/UserService';
import { BookingDTO } from './model/BookingDTO';
import { BookingService } from './service/BookingService';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  providers: [DatePipe],
})
export class BookingDetailComponent implements OnInit {
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

  // 日期选择数组
  dateRange = [];

  // 是否可见
  isVisible = false;

  // ok读取
  isOkLoading = false;

  // 房间名称
  roomName = '';

  // 房间选择值
  roomOptions: any[] | null = null;

  // 值
  values: any[] | null = null;

  // 用户数组
  users = [];

  // 日期格式化
  dateFormat = 'yyyy-MM-dd';

  // 预约订单初始化函数
  paramsItem = this.initBooking();

  /**
   * 构建整改单位到人  map
   */
  organizationTreeMap: Map<string, string> = new Map<string, string>();

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.bookingService.create(this.paramsItem).subscribe((data) => {});

    setTimeout(() => {
      this.notification.emit();
      this.msg.success('新增成功');
    }, 1000);
    this.handleCancel();
  }

  handleCancel(): void {
    this.form.reset('form');
    this.isVisible = false;
  }

  submitForm(value: any): void {
    // tslint:disable-next-line:forin
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    console.log(value);
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    // tslint:disable-next-line:forin
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  /**
   *
   * 日期点击函数
   */
  chooseDate(result: Date): void {
    if (this.dateRange && this.dateRange[0] && this.dateRange[1]) {
      this.paramsItem.startDate = this.datepipe.transform(this.dateRange[0], 'yyyy-MM-dd');
      this.paramsItem.endDate = this.datepipe.transform(this.dateRange[1], 'yyyy-MM-dd');
    }
    console.log(this.dateRange);
    console.log(result);
  }

  /**
   * 点击级联查询
   */
  chooseRoom(values: any): void {
    if (values && values[1]) {
      this.paramsItem.room_Id = values[1];
    }
    // this.roomName = this.roomOptions.find(item => item.id === values[1]).roomName;
    console.log(values);
  }

  /**
   *
   */
  chooseUser(values: any) {
    console.log(values);
  }

  /**
   *
   * @param item 初始化订单函数
   * @returns 订单
   */
  initBooking(item?: BookingDTO): BookingDTO {
    return {
      id: item ? item.id : null,
      room_Id: item ? item.room_Id : null,
      user_Id: item ? item.user_Id : null,
      totalPrice: item ? item.totalPrice : null,
      startDate: item ? item.startDate : null,
      endDate: item ? item.endDate : null,
      modifyTime: item ? item.modifyTime : null,
      createTime: item ? item.createTime : null,
      status: item ? item.status : null,
    };
  }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roomService: RoomService,
    private bookingService: BookingService,
    private msg: NzMessageService,
    private datepipe: DatePipe,
  ) {
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      confirm: ['', [this.confirmValidator]],
      comment: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.loadRoom();

    this.loadUser();
  }

  loadUser() {
    this.userService.findAll().subscribe((data) => {
      this.users = data;
    });
  }

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
    data = data.filter((row) => row.id > 0);
    data = [...data];
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
}
