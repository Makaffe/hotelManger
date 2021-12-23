import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '../../UserComponent/service/UserService';

@Component({
  selector: 'passport-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class UserRegisterComponent implements OnInit {
  constructor(
    fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    public http: _HttpClient,
    public msg: NzMessageService,
  ) {
    this.form = fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.checkPassword.bind(this)]],
      confirm: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.passwordEquar]],
      phonePrefix: ['+86'],
      phone: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      identityPrefix: ['大陆居民'],
      identity: [null, [Validators.required, Validators.minLength(18), Validators.maxLength(18)]],
      name: [null, [Validators.required]],
    });
  }

  // #region fields

  get mail() {
    return this.form.controls.mail;
  }
  get password() {
    return this.form.controls.password;
  }
  get confirm() {
    return this.form.controls.confirm;
  }
  get phone() {
    return this.form.controls.phone;
  }
  get identity() {
    return this.form.controls.identity;
  }
  get name() {
    return this.form.controls.name;
  }
  get captcha() {
    return this.form.controls.captcha;
  }
  form: FormGroup;
  error = '';
  type = 0;
  visible = false;
  status = 'pool';
  progress = 0;
  passwordProgressMap = {
    ok: 'success',
    pass: 'normal',
    pool: 'exception',
  };

  // #endregion

  // #region get captcha

  count = 0;
  interval$: any;

  static checkPassword(control: FormControl) {
    if (!control) {
      return null;
    }
    const self: any = this;
    self.visible = !!control.value;
    if (control.value && control.value.length > 9) {
      self.status = 'ok';
    } else if (control.value && control.value.length > 5) {
      self.status = 'pass';
    } else {
      self.status = 'pool';
    }

    if (self.visible) {
      self.progress = control.value.length * 10 > 100 ? 100 : control.value.length * 10;
    }
  }

  static passwordEquar(control: FormControl) {
    if (!control || !control.parent) {
      return null;
    }
    if (control.value !== control.parent.get('password').value) {
      return { equar: true };
    }
    return null;
  }

  // getCaptcha() {
  //   if (this.phone.invalid) {
  //     this.phone.markAsDirty({ onlySelf: true });
  //     this.phone.updateValueAndValidity({ onlySelf: true });
  //     return;
  //   }
  //   this.count = 59;
  //   this.interval$ = setInterval(() => {
  //     this.count -= 1;
  //     if (this.count <= 0) {
  //       clearInterval(this.interval$);
  //     }
  //   }, 1000);
  // }

  // #endregion

  submit() {
    this.error = '';
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    const userData = this.form.value;
    // tslint:disable-next-line:no-shadowed-variables
    this.userService.registry(userData).subscribe((data) => {
      if (data) {
        this.msg.success('普通用户注册成功');
        this.router.navigateByUrl('/passport/login');
      } else {
        this.msg.error('请联系管理员');
      }
    });
  }
  ngOnInit(): void {}
}
