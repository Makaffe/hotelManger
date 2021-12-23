import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CacheService } from '@delon/cache';
import { SettingsService, User } from '@delon/theme';

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  role = this.cacheService.get('__user', { mode: 'none' }).userType;
  get user(): User {
    return this.settings.user;
  }

  constructor(private settings: SettingsService, private cacheService: CacheService) {}
}
