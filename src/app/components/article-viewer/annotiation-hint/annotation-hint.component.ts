import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-annotation-hint',
  template: `
    <div class="annotation-hint">
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      Select any text to create an annotation
    </div>
  `,
  styles: `
    .annotation-hint {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 2rem;
      font-size: 0.75rem;
      color: var(--text-muted);
      background-color: var(--surface-1);
      border-bottom: 1px solid var(--border-subtle);
      flex-shrink: 0;

      svg {
        opacity: 0.6;
        flex-shrink: 0;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationHint {}
