import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core';
import { Annotation } from '../../models/annotation';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';

export interface AnnotationDialogResult {
  readonly color: string;
  readonly note: string;
}

export const ANNOTATION_COLORS = [
  { value: '#FFEB3B', label: 'Yellow' },
  { value: '#A5D6A7', label: 'Green' },
  { value: '#90CAF9', label: 'Blue' },
  { value: '#F48FB1', label: 'Pink' },
  { value: '#FFCC80', label: 'Orange' },
  { value: '#CE93D8', label: 'Purple' },
];

@Component({
  selector: 'app-annotation-dialog',
  templateUrl: './annotation-dialog.html',
  styleUrls: ['./annotation-dialog.scss'],
  imports: [FormsModule, SlicePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationDialog {
  readonly visible = input(false);
  readonly selectedText = input('');
  readonly editingAnnotation = input<Annotation | null>(null);

  readonly confirm = output<AnnotationDialogResult>();
  readonly cancel = output();
  readonly deleteAnnotation = output();

  protected readonly colors = ANNOTATION_COLORS;

  protected readonly selectedColor = linkedSignal(
    () => this.editingAnnotation()?.color ?? ANNOTATION_COLORS[0].value,
  );

  protected readonly note = linkedSignal(() => this.editingAnnotation()?.note ?? '');

  submit(): void {
    this.confirm.emit({ color: this.selectedColor(), note: this.note().trim() });
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('dialog-overlay')) {
      this.cancel.emit();
    }
  }
}
