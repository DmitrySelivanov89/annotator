import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  template: `
    <button [class]="computedClass()" [title]="title()" (click)="clicked.emit()">
      <ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButton {
  readonly variant = input<'ghost' | 'primary' | 'danger-ghost'>('ghost');
  readonly size = input<'sm' | 'md'>('sm');
  readonly title = input('');

  readonly clicked = output();

  protected readonly computedClass = computed(() => `btn btn-${this.variant()} btn-${this.size()}`);
}
