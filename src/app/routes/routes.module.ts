import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { RouteRoutingModule } from './routes-routing.module';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { BookingComponent } from './booking/booking.component';
import { RoomComponent } from './room/room.component';
import { userCommentComponent } from './UserComponent/userComment/userComment.component';
import { UserRecommendComponent } from './UserComponent/userRecommend/userRecommend.component';
import { BookingDetailComponent } from './booking/booking-detail.component';
import { RoomDetailComponent } from './room/roomdetail.component';
import { CommentDetailComponent } from './UserComponent/userComment/comment-detail.component';
import { RoleComponent } from './role/role.component';
import { RoleDetailComponent } from './role/role-detail.component';

const COMPONENTS = [
  RoleComponent,
  DashboardComponent,
  userCommentComponent,
  CommentDetailComponent,
  RoleDetailComponent,
  // passport pages
  UserLoginComponent,
  BookingDetailComponent,
  RoomDetailComponent,
  UserRecommendComponent,
  BookingComponent,
  RoomComponent,
  UserRegisterComponent,
  UserRegisterResultComponent,
  // single pages
  CallbackComponent,
  UserLockComponent,
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, RouteRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class RoutesModule {}
