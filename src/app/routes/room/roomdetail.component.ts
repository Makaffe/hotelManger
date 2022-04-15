import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { _HttpClient } from '@delon/theme';

import { EChartsOption } from 'echarts';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { RoomDTO } from './model/RoomDTO';
import { RoomService } from './service/RoomService';

@Component({
  selector: 'app-room-detail',
  templateUrl: './roomdetail.component.html',
})
export class RoomDetailComponent implements OnInit {
  /**
   * 表单组件
   */
  @ViewChild('form', { static: false })
  form: NgForm;

  /**
   * 发送通知
   */
  // tslint:disable-next-line:member-ordering
  @Output()
  notification = new EventEmitter<any>();

  // 表单
  // tslint:disable-next-line:member-ordering
  validateForm: FormGroup;

  // 是否只是查看
  isWatch = false;

  // 是否在楼层中添加房间
  isAddRoom = false;

  // 是否可见
  isVisible = false;

  // ok读取
  // tslint:disable-next-line:member-ordering
  isOkLoading = false;

  // 楼层名称
  // tslint:disable-next-line:member-ordering
  hallName = '';

  // 房间名称
  // tslint:disable-next-line:member-ordering
  houseName = '';

  // 值
  values: any[] | null = null;

  // 预约订单初始化函数
  paramsItem = this.initRoom();
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
      del_flag: item ? item.del_flag : null,
    };
  }

  addHall(): void {
    this.isAddRoom = false;
    this.isVisible = true;
  }
  addRoom(item: RoomDTO, isWatch: boolean): void {
    this.isAddRoom = true;
    this.isWatch = isWatch;
    this.paramsItem.hallName = item.hallName;
    this.paramsItem.parent_Id = item.id;
    this.isVisible = true;
  }
  editRoom(item: RoomDTO, isWatch: boolean): void {
    this.isWatch = isWatch;
    this.paramsItem = this.initRoom(item);
    this.isVisible = true;
  }

  handleOk(): void {
    if (!this.isAddRoom) {
      if ((this.paramsItem.roomName || this.paramsItem.hallName || this.paramsItem.description || this.paramsItem.status) === null) {
        this.msg.error('请填好带*号的内容');
        return;
      }
    } else {
      if (
        (this.paramsItem.roomName ||
          this.paramsItem.hallName ||
          this.paramsItem.description ||
          this.paramsItem.status ||
          this.paramsItem.image ||
          this.paramsItem.price) === null
      ) {
        this.msg.error('请填好带*号的内容');
        return;
      }
    }
    this.roomService.create(this.paramsItem).subscribe((data) => {
      this.notification.emit();
      this.msg.success('修改成功');
      this.handleCancel();
    });
  }

  handleCancel(): void {
    this.form.reset('form');
    this.isVisible = false;
  }

  constructor(private roomService: RoomService, private msg: NzMessageService) {}
  ngOnInit(): void {}
}
