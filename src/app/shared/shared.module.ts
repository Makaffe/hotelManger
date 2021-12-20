import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlainThemeModule } from '@delon/theme';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { TranslateModule } from '@ngx-translate/core';
import { NzListModule } from 'ng-zorro-antd/list';
import { NgxEchartsModule } from 'ngx-echarts';
import { SHARED_DELON_MODULES } from './shared-delon.module';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';
import { AngularSplitModule } from 'angular-split';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
// #region third libs

const THIRDMODULES = [];

// #endregion

// #region your componets & directives

const COMPONENTS = [];
const DIRECTIVES = [];

// #endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonACLModule,
    NgxEchartsModule,
    NzSkeletonModule,
    DelonFormModule,
    AngularSplitModule,
    NzListModule,
    NzCascaderModule,
    NzDatePickerModule,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES,
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonACLModule,
    DelonFormModule,
    NgxEchartsModule,
    TranslateModule,
    NzSkeletonModule,
    AngularSplitModule,
    NzListModule,
    NzCascaderModule,
    NzDatePickerModule,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
})
export class SharedModule {}
