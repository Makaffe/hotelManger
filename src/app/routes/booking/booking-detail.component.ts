import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
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

  // 房间Id
  room_Id = '';

  // 房间选择值
  roomOptions: any[] | null = null;

  // 值
  values: any[] | null = null;

  // 用户数组
  users = [];

  // 日期格式化
  dateFormat = 'yyyy-MM-dd';

  // 今天
  today = new Date();
  // 预约订单初始化函数
  paramsItem = this.initBooking();

  /**
   * 构建整改单位到人  map
   */
  organizationTreeMap: Map<string, string> = new Map<string, string>();

  showModal(item?: BookingDTO): void {
    if (item.room_Id != null) {
      this.room_Id = item.room_Id;
    }
    this.paramsItem = this.initBooking(item);
    this.isVisible = true;
  }

  handleOk(): void {
    this.paramsItem.id = null;
    if (
      this.paramsItem.room_Id === null ||
      this.paramsItem.user_Id === null ||
      this.paramsItem.startDate === null ||
      this.paramsItem.endDate === null
    ) {
      this.msg.error('请把带*号的信息填完');
      return;
    }
    const todayStr = this.datepipe.transform(this.today, 'yyyy-MM-dd');
    if (this.datepipe.transform(this.dateRange[0], 'yyyy-MM-dd') > todayStr) {
      this.msg.error('开始时间只能选择今天');
      return;
    }

    this.bookingService.create(this.paramsItem).subscribe((data) => {
      this.notification.emit();
      this.msg.success('新增成功');
      this.handleCancel();
    });
  }

  handleCancel(): void {
    this.form.reset('form');
    this.isVisible = false;
  }

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
      commentStatus: item ? item.commentStatus : null,
    };
  }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roomService: RoomService,
    private bookingService: BookingService,
    private msg: NzMessageService,
    private datepipe: DatePipe,
  ) {}
  ngOnInit(): void {
    this.loadRoom();

    this.loadUser();
  }

  loadUser() {
    this.userService.findAll().subscribe((data) => {
      this.users = data.filter((row) => row.userType === 'User');
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
    data = data.filter((row) => row.id > 0 && row.status === true);
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

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) < 0;
  };
}
