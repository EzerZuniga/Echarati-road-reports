import { Pipe, PipeTransform } from '@angular/core';
import { ReportCategory } from '../models/report.model';
import { getCategoryLabel } from '../utils/report-ui.helpers';

/**
 * Transforms a ReportCategory enum value into a human-readable Spanish label.
 * Usage: {{ report.category | categoryLabel }}
 */
@Pipe({
  name: 'categoryLabel',
})
export class ReportCategoryLabelPipe implements PipeTransform {
  transform(value: ReportCategory): string {
    return getCategoryLabel(value);
  }
}
