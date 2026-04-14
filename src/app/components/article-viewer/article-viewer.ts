import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Annotation } from '../../models/annotation';
import { AnnotationService } from '../../services/annotation.service';
import { ArticleService } from '../../services/article.service';
import { DialogService } from '../../services/dialog.service';
import { getTextOffset } from '../../utils/text.utils';
import { AnnotationsPanel } from './annotations-panel/annotations-panel';
import { AnnotationTooltip, TooltipState } from './annotation-tooltip/annotation-tooltip';
import { AnnotationHint } from './annotiation-hint/annotation-hint.component';
import { Highlight } from '../../directives/highlight';
import { IconButton } from '../shared/icon-button/icon-button';

@Component({
  selector: 'app-article-viewer',
  templateUrl: './article-viewer.html',
  styleUrls: ['./article-viewer.scss'],
  imports: [
    DatePipe,
    AnnotationsPanel,
    AnnotationTooltip,
    AnnotationHint,
    Highlight,
    IconButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AnnotationService],
})
export class ArticleViewer {
  private readonly annotationService = inject(AnnotationService);
  private readonly articleService = inject(ArticleService);
  private readonly dialogService = inject(DialogService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  protected readonly article = computed(
    () => this.articleService.articles().find((a) => a.id === this.id())!,
  );

  private readonly contentEl = viewChild.required<ElementRef<HTMLDivElement>>('contentEl');

  protected readonly annotations = computed(() => {
    const id = this.id();
    return this.annotationService.annotations().filter((a) => a.articleId === id);
  });

  protected readonly annotationCount = computed(() => this.annotations().length);

  protected readonly tooltipState = signal<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    annotation: undefined,
  });

  constructor() {
    effect(() => {
      const id = this.id();
      const article = this.articleService.articles().find((a) => a.id === id);
      if (id && !article) {
        this.router.navigate(['/']);
      }
    });
  }

  onEditArticle(): void {
    this.router.navigate(['/articles', this.id(), 'edit']);
  }

  onMouseUp(): void {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const container = this.contentEl().nativeElement;

    if (
      !container.contains(range.commonAncestorContainer) &&
      range.commonAncestorContainer !== container
    ) {
      return;
    }

    const selectedText = selection.toString().trim();

    if (!selectedText) return;

    const start = getTextOffset(container, range.startContainer, range.startOffset);
    const end = getTextOffset(container, range.endContainer, range.endOffset);

    if (start === end) return;

    selection.removeAllRanges();

    this.dialogService
      .openAnnotationDialog({ selectedText, editingAnnotation: null })
      .subscribe((result) => {
        if (result && result !== 'delete') {
          this.annotationService.create({
            articleId: this.article().id,
            startOffset: start,
            endOffset: end,
            selectedText,
            color: result.color,
            note: result.note,
          });
        }
      });
  }

  onHighlightClick(annotation: Annotation): void {
    this.tooltipState.update((s) => ({ ...s, visible: false }));
    this.dialogService
      .openAnnotationDialog({
        selectedText: annotation.selectedText,
        editingAnnotation: annotation,
      })
      .subscribe((result) => {
        if (!result) return;
        if (result === 'delete') {
          this.annotationService.delete(annotation.id);
        } else {
          this.annotationService.update(annotation.id, result.note, result.color);
        }
      });
  }

  onHighlightHover(event: { annotation: Annotation; rect: DOMRect }): void {
    this.tooltipState.set({
      visible: true,
      x: event.rect.left + event.rect.width / 2,
      y: event.rect.top - 8,
      annotation: event.annotation,
    });
  }

  onHighlightLeave(): void {
    this.tooltipState.update((prev) => ({ ...prev, visible: false }));
  }

  onDeleteArticle(): void {
    const article = this.article();
    this.dialogService
      .openConfirm(
        'Delete article',
        `Delete "${article.title}"? This will also remove all its annotations.`,
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          this.annotationService.deleteForArticle(article.id);
          this.articleService.delete(article.id);
          this.router.navigate(['/']);
        }
      });
  }

  selectChip(ann: Annotation): void {
    this.dialogService
      .openAnnotationDialog({ selectedText: ann.selectedText, editingAnnotation: ann })
      .subscribe((result) => {
        if (!result) return;
        if (result === 'delete') {
          this.annotationService.delete(ann.id);
        } else {
          this.annotationService.update(ann.id, result.note, result.color);
        }
      });
  }
}
