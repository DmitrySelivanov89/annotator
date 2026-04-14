import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { Annotation } from '../../../models/annotation';

@Component({
  selector: 'app-annotations-panel',
  templateUrl: './annotations-panel.html',
  styleUrls: ['./annotations-panel.scss'],
  imports: [SlicePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationsPanel {
  readonly annotations = input.required<Annotation[]>();
  readonly selectAnnotation = output<Annotation>();
}
