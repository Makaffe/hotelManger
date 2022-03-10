import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CacheService } from '@delon/cache';
import { NzMessageService } from 'ng-zorro-antd';
import { NotifyService } from './Service/NotifyService';

@Component({
  selector: 'header-icon',
  template: `
    <div
      class="alain-default__nav-item"
      nz-dropdown
      [nzDropdownMenu]="iconMenu"
      nzTrigger="click"
      nzPlacement="bottomRight"
      (nzVisibleChange)="change()"
    >
      <i nz-icon nzType="appstore"></i>
    </div>
    <nz-dropdown-menu #iconMenu="nzDropdownMenu">
      <div nz-menu class="wd-xl animated jello">
        <nz-spin [nzSpinning]="loading" [nzTip]="'正在加载...'">
          <div nz-row [nzType]="'flex'" [nzJustify]="'center'" [nzAlign]="'middle'" class="app-icons">
            <div nz-col [nzSpan]="6">
              <i nz-icon nzType="calendar" class="bg-error text-white" [routerLink]="['/userRecommend']"></i>
              <small>房间预定</small>
            </div>
            <div nz-col [nzSpan]="6">
              <i nz-icon nzType="file" class="bg-geekblue text-white" [routerLink]="['/booking']"></i>
              <small>我的订单</small>
            </div>
            <div nz-col [nzSpan]="6">
              <i nz-icon nzType="star" class="bg-magenta text-white" [routerLink]="['/userComment']"></i>
              <small>我的评论</small>
            </div>
            <div nz-col [nzSpan]="6">
              <i nz-icon nzType="team" class="bg-purple text-white" (click)="showModal()"></i>
              <small>呼叫客服</small>
            </div>
            <div nz-col [nzSpan]="6">
              <i nz-icon nzType="team" class="bg-purple text-white"></i>
              <small>Team</small>
            </div>
            <div nz-col [nzSpan]="6">
              <i nz-icon nzType="scan" class="bg-warning text-white"></i>
              <small>QR</small>
            </div>
            <div nz-col [nzSpan]="6">
              <i nz-icon nzType="pay-circle" class="bg-cyan text-white"></i>
              <small>Pay</small>
            </div>
            <div nz-col [nzSpan]="6">
              <i nz-icon nzType="printer" class="bg-grey text-white"></i>
              <small>Print</small>
            </div>
          </div>
        </nz-spin>
      </div>
    </nz-dropdown-menu>

    <nz-modal [(nzVisible)]="isVisible" nzTitle="呼叫客服" (nzOnCancel)="handleCancel()" (nzOnOk)="handleOk()">
      <nz-form-item>
        <nz-form-label [nzSpan]="7" nzRequired>内容</nz-form-label>
        <nz-form-control [nzSpan]="12" nzHasFeedback nzValidatingTip="Validating...">
          <textarea rows="4" nz-input [(ngModel)]="content"></textarea>
        </nz-form-control>
      </nz-form-item>
    </nz-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderIconComponent {
  content = '';
  loading = true;
  isVisible = false;
  inputValue?: string;

  initMessage = this.InitMessage();

  // 房间选择值
  roomOptions: any[] | null = null;

  userId = this.cacheService.get('__user', { mode: 'none' }).id;

  constructor(
    private cdr: ChangeDetectorRef,
    private notifyService: NotifyService,
    private cacheService: CacheService,
    private msg: NzMessageService,
  ) {}

  change() {
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.initMessage.user_Id = this.userId;
    this.initMessage.content = this.content;
    this.notifyService.addMessage(this.initMessage).subscribe((data) => {
      this.msg.success('发送消息成功');
      this.handleCancel();
    });
    this.handleCancel();
  }

  handleCancel(): void {
    this.initMessage = this.InitMessage();
    this.isVisible = false;
  }

  InitMessage(item?: any) {
    return {
      id: item ? item.id : null,
      status: item ? item.status : null,
      user_Id: item ? item.user_Id : null,
      content: item ? item.content : null,
    };
  }
}
