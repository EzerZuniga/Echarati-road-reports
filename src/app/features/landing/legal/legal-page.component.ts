import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { map, Observable } from 'rxjs';
import { LEGAL_PAGES_CONTENT, LegalPageContent, LegalPageType } from './legal-content';

const DEFAULT_PAGE_TYPE: LegalPageType = 'privacy';

@Component({
  selector: 'app-legal-page',
  templateUrl: './legal-page.component.html',
  styleUrls: ['./legal-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalPageComponent {
  public readonly currentYear = new Date().getFullYear();

  public readonly pageContent$: Observable<LegalPageContent> = this.route.data.pipe(
    map((data: Data) => this.resolveContent(data)),
  );

  public constructor(private readonly route: ActivatedRoute) {}

  public trackBySectionTitle(_: number, section: { title: string }): string {
    return section.title;
  }

  public trackByBullet(_: number, bullet: string): string {
    return bullet;
  }

  private resolveContent(data: Data): LegalPageContent {
    const pageType = this.isLegalPageType(data['legalPageType'])
      ? data['legalPageType']
      : DEFAULT_PAGE_TYPE;
    return LEGAL_PAGES_CONTENT[pageType];
  }

  private isLegalPageType(value: unknown): value is LegalPageType {
    return value === 'privacy' || value === 'terms';
  }
}
