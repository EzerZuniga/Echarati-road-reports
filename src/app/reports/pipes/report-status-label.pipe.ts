import { Pipe, PipeTransform } from '@angular/core';
import { ReportStatus } from '../models/report.model';
import { getStatusLabel } from '../utils/report-ui.helpers';

/**
 * Transforms a ReportStatus enum value into a human-readable Spanish label.
 * Usage: {{ report.status | statusLabel }}
 */
@Pipe({
  name: 'statusLabel',
})
export class ReportStatusLabelPipe implements PipeTransform {
  transform(value: ReportStatus): string {
    return getStatusLabel(value);
  }
}
