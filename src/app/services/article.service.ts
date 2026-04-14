import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { Article } from '../models/article';

const STORAGE_KEY = 'annotator_articles';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private readonly storage = inject(StorageService);

  private readonly _articles = signal<Article[]>(this.storage.get<Article[]>(STORAGE_KEY) ?? []);

  readonly articles = this._articles.asReadonly();

  private save(articles: Article[]): void {
    this.storage.set(STORAGE_KEY, articles);
    this._articles.set(articles);
  }

  create(title: string, content: string): Article {
    const now = Date.now();
    const article: Article = {
      id: crypto.randomUUID(),
      title,
      content,
      createdAt: now,
      updatedAt: now,
    };
    this.save([...this._articles(), article]);
    return article;
  }

  update(id: string, title: string, content: string): Article | null {
    const articles = this._articles();
    const article = articles.find((a) => a.id === id);

    if (!article) return null;

    const updated: Article = {
      ...article,
      title,
      content,
      updatedAt: Date.now(),
    };

    this.save(articles.map((a) => (a.id === id ? updated : a)));
    return updated;
  }

  delete(id: string): void {
    this.save(this._articles().filter((a) => a.id !== id));
  }
}
