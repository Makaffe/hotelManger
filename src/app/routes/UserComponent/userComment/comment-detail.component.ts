import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { _HttpClient } from '@delon/theme';

import { EChartsOption } from 'echarts';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { UserCommentService } from '../service/UserCommentService';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
})
export class CommentDetailComponent implements OnInit {
  constructor(private userCommentService: UserCommentService, private msg: NzMessageService) {}

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

  // 是否在商家回复
  isBusiness = false;

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

  // 预约订单初始化函数
  paramsItem = this.initComment();

  // 添加评论的回调
  addComment(data: any): void {
    if (data.order_Id) {
      this.isBusiness = true;
      this.paramsItem = this.initComment(data);
      this.paramsItem.id = null;
      this.paramsItem.content = null;
      this.paramsItem.parent_Id = data.id;
    } else {
      this.paramsItem = this.initComment(data);
      this.paramsItem.id = null;
      this.paramsItem.order_Id = data.id;
    }
    this.isVisible = true;
  }

  // 确认的回调
  handleOk() {
    this.userCommentService.create(this.paramsItem).subscribe((data) => {
      this.msg.success('评论成功');
      this.notification.emit();
      this.handleCancel();
    });
  }

  // 取消的回调
  handleCancel() {
    this.form.reset('form');
    this.isVisible = false;
  }
  initComment(item?: any): any {
    return {
      id: item ? item.id : null,
      content: item ? item.content : null,
      order_Id: item ? item.order_Id : null,
      room_Id: item ? item.room_Id : null,
      user_Id: item ? item.user_Id : null,
      parent_Id: item ? item.parent_Id : null,
    };
  }
  ngOnInit(): void {}
}
