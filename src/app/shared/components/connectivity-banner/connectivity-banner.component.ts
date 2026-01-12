import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NetworkService } from '../../../core/services/network.service';

@Component({
  selector: 'app-connectivity-banner',
  templateUrl: './connectivity-banner.component.html',
  styleUrls: ['./connectivity-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectivityBannerComponent {
  readonly online$ = this.network.online$;

  constructor(private network: NetworkService) {}
}
