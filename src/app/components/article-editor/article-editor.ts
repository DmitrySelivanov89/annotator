import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-article-editor',
  templateUrl: './article-editor.html',
  styleUrls: ['./article-editor.scss'],
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleEditor {
  private readonly articleService = inject(ArticleService);
  private readonly router = inject(Router);

  readonly id = input<string>();

  protected readonly article = computed(() => {
    const id = this.id();
    return this.articleService.articles().find((a) => a.id === id);
  });

  protected readonly title = linkedSignal(() => this.article()?.title ?? '');

  protected readonly content = linkedSignal(() => this.article()?.content ?? '');

  protected readonly isNew = computed(() => !this.id());

  protected readonly canSave = computed(() => {
    return this.title().trim().length > 0 && this.content().trim().length > 0;
  });

  save(): void {
    const trimmedTitle = this.title().trim();
    const trimmedContent = this.content().trim();

    if (!trimmedTitle || !trimmedContent) return;

    const result = this.isNew()
      ? this.articleService.create(trimmedTitle, trimmedContent)
      : this.articleService.update(this.id()!, trimmedTitle, trimmedContent);

    if (result) {
      this.router.navigate(['/articles', result.id]);
    }
  }

  cancel(): void {
    const id = this.id();
    this.router.navigate(id ? ['/articles', id] : ['/']);
  }
}
