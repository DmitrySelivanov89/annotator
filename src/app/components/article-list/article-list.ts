import { Component, inject, output, input, ChangeDetectionStrategy } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { DatePipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.html',
  styleUrls: ['./article-list.scss'],
  imports: [SlicePipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleList {
  private readonly articleService = inject(ArticleService);

  readonly selectedId = input<string>();

  readonly selectArticle = output<string>();

  readonly createNew = output();

  protected readonly articles = this.articleService.articles;

  select(id: string): void {
    this.selectArticle.emit(id);
  }
}
