import { Directive, effect, ElementRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, fromEvent, map, tap } from 'rxjs';
import { Annotation } from '../models/annotation';
import { escapeHtml } from '../utils/text.utils';

interface HighlightEvt {
  readonly pos: number;
  readonly type: 'open' | 'close';
  readonly annotation: Annotation;
}

@Directive({ selector: '[appHighlight]' })
export class Highlight {
  private readonly el = inject(ElementRef<HTMLDivElement>);

  readonly annotations = input<Annotation[]>([]);
  readonly content = input('');

  readonly annotationClick = output<Annotation>();
  readonly annotationHover = output<{ annotation: Annotation; rect: DOMRect }>();
  readonly annotationLeave = output();

  constructor() {
    const container: HTMLElement = this.el.nativeElement;
    effect(() => this.render(this.annotations(), this.content()));

    fromEvent<MouseEvent>(container, 'mouseover')
      .pipe(
        map((e) => ({
          mark: (e.target as Element).closest<HTMLElement>('.highlight'),
          prevMark: (e.relatedTarget as Element | null)?.closest<HTMLElement>('.highlight'),
        })),
        filter(({ mark, prevMark }) => !!mark && mark !== prevMark),
        map(({ mark }) => ({
          mark: mark!,
          annotation: this.annotations().find((a) => a.id === mark!.getAttribute('data-ann-id')),
        })),
        filter((x): x is { mark: HTMLElement; annotation: Annotation } => !!x.annotation),
        takeUntilDestroyed(),
      )
      .subscribe(({ mark, annotation }) =>
        this.annotationHover.emit({ annotation, rect: mark.getBoundingClientRect() }),
      );

    fromEvent<MouseEvent>(container, 'mouseout')
      .pipe(
        map((e) => ({ mark: (e.target as Element).closest<HTMLElement>('.highlight'), e })),
        filter((x): x is { mark: HTMLElement; e: MouseEvent } => !!x.mark),
        filter(({ mark, e }) => !mark.contains(e.relatedTarget as Node | null)),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.annotationLeave.emit());

    fromEvent<MouseEvent>(container, 'click')
      .pipe(
        map((e) => ({ e, mark: (e.target as Element).closest<HTMLElement>('.highlight') })),
        filter((x): x is { e: MouseEvent; mark: HTMLElement } => !!x.mark),
        tap(({ e }) => e.stopPropagation()),
        map(({ mark }) =>
          this.annotations().find((a) => a.id === mark.getAttribute('data-ann-id')),
        ),
        filter((a): a is Annotation => !!a),
        takeUntilDestroyed(),
      )
      .subscribe((annotation) => this.annotationClick.emit(annotation));
  }

  private render(annotations: Annotation[], content: string): void {
    const container = this.el.nativeElement;

    if (!annotations.length) {
      container.innerHTML = escapeHtml(content);
      return;
    }

    const events: HighlightEvt[] = [];

    for (const ann of annotations) {
      const start = Math.max(0, ann.startOffset);
      const end = Math.min(content.length, ann.endOffset);

      if (start >= end) continue;

      events.push({ pos: start, type: 'open', annotation: ann });
      events.push({ pos: end, type: 'close', annotation: ann });
    }

    events.sort((a, b) => {
      if (a.pos !== b.pos) return a.pos - b.pos;
      return a.type === 'close' ? -1 : 1;
    });

    const activeStack: Annotation[] = [];
    let result = '';
    let cursor = 0;

    for (const evt of events) {
      if (evt.pos > cursor) {
        const chunk = escapeHtml(content.slice(cursor, evt.pos));
        if (activeStack.length > 0) {
          const top = activeStack[activeStack.length - 1];
          result += `<mark class="highlight" style="background:${top.color}" data-ann-id="${top.id}">${chunk}</mark>`;
        } else {
          result += chunk;
        }
        cursor = evt.pos;
      }

      if (evt.type === 'open') {
        activeStack.push(evt.annotation);
      } else {
        const idx = activeStack.findIndex((a) => a.id === evt.annotation.id);
        if (idx !== -1) activeStack.splice(idx, 1);
      }
    }

    if (cursor < content.length) {
      result += escapeHtml(content.slice(cursor));
    }

    container.innerHTML = result;
  }
}
