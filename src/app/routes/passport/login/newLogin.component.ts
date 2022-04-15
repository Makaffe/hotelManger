import { Component, ElementRef, Inject, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN, ITokenService, SocialOpenType, SocialService, TokenService } from '@delon/auth';
import { CacheService } from '@delon/cache';
import { SettingsService, _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { forkJoin } from 'rxjs';
import { UserService } from '../../UserComponent/service/UserService';

@Component({
  selector: 'passport-newLogin',
  templateUrl: './newLogin.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class NewLoginComponent implements OnInit {
  /**
   * 表单数据
   */
  paramsItem = this.initLogin();

  /**
   * 用户类型列表
   */
  userTypeList = [
    { label: '管理人员', value: 'Manager' },
    { label: '工作人员', value: 'Worker' },
    { label: '普通用户', value: 'User' },
  ];

  /**
   * 需要缓存的用户信息对象
   */
  userInfo = {
    id: '',
    username: '',
    password: '',
    identity: '',
    name: '',
    phone: '',
    bookingTime: '',
    userType: '',
  };

  /**
   * 记录用户Id
   */
  userId = '';

  /**
   * 登录按钮加载
   */
  loginLoading = false;

  constructor(
    private router: Router,
    private msg: NzMessageService,
    private cacheService: CacheService,
    private starupService: StartupService,
    private userService: UserService,
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
  ) {}
  ngOnInit(): void {}

  initLogin(item?: any) {
    return {
      id: item ? item.id : null,
      username: item ? item.username : null,
      password: item ? item.password : null,
      identity: item ? item.identity : null,
      name: item ? item.name : null,
      phone: item ? item.phone : null,
      bookingTime: item ? item.bookingTime : null,
      userType: item ? item.userType : 'User',
    };
  }

  login() {
    if ((this.paramsItem.userType || this.paramsItem.username || this.paramsItem.password) === null) {
      this.msg.error('请把带*号的内容填满');
      return;
    }
    this.loginLoading = true;
    this.userService.loginCheck(this.paramsItem).subscribe((data) => {
      if (data) {
        this.msg.success('恭喜您，登陆成功');
        this.loginLoading = false;
        this.afterLogin(data);
      } else {
        this.msg.error('用户名或密码或身份错误');
        this.loginLoading = false;
      }
    });
  }

  registry() {
    this.router.navigateByUrl('/passport/register');
  }

  /**
   * 登录成功后执行
   */
  afterLogin(data: any) {
    // 记录用户缓存信息
    this.cacheService.set('__user', data, {});
    // 清空路由复用信息
    this.reuseTabService.clear();

    // 设置用户Token信息
    this.tokenService.set(data);
    if (data.userType !== 'User') {
      this.starupService.load().then(() => {
        // if (url.includes('/passport')) {
        //   url = '/dashboard';
        // }
        this.router.navigateByUrl('/dashboard');
      });
    } else {
      this.router.navigateByUrl('/userRecommend');
    }

    // 查询当前登录人信息
    // const user$ = this.userService.findUserById(data.userId);
    // const user$ = data;
    // forkJoin([user$]).subscribe(result => {
    //   if (!result) {
    //     return;
    //   }

    //   // 处理用户信息请求结果
    //   this.userId = data.id;
    //   // 缓存用户信息

    //   // 检查用户角色, 角色由后台sql脚本初始化，id需明确（1.系统管理员， 2.审计人员，3.纪检部门，4.整改部门）
    //   switch (this.paramsItem.userType) {
    //     case 'Manager':
    //       this.starupService.load().then(() => this.router.navigate(['/dashboard']));
    //       break;
    //     case 'Worker':
    //       this.starupService.load().then(() => this.router.navigate(['/dashboard']));
    //       break;
    //     case 'User':
    //       this.starupService.load().then(() => this.router.navigate(['/userRecommend']));
    //       break;
    //     default:
    //       break;
    //   }

    //   //   this.starupService.load().then(() => this.router.navigate(['/navigation']));
    // });
  }
}
