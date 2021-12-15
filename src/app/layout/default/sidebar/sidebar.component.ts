import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SettingsService, User } from '@delon/theme';

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  @Input()
  role: string;
  get user(): User {
    return this.settings.user;
  }

  constructor(private settings: SettingsService) { }
}
