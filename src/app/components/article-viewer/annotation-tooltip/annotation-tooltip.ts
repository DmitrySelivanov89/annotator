import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { Annotation } from '../../../models/annotation';

export interface TooltipState {
  readonly visible: boolean;
  readonly x: number;
  readonly y: number;
  readonly annotation: Annotation | undefined;
}

@Component({
  selector: 'app-annotation-tooltip',
  templateUrl: './annotation-tooltip.html',
  styleUrls: ['./annotation-tooltip.scss'],
  imports: [SlicePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationTooltip {
  readonly state = input.required<TooltipState>();
}
