import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { Annotation } from '../models/annotation';

const STORAGE_KEY = 'annotator_annotations';

@Injectable()
export class AnnotationService {
  private readonly storage = inject(StorageService);

  private readonly _annotations = signal<Annotation[]>(
    this.storage.get<Annotation[]>(STORAGE_KEY) ?? [],
  );

  readonly annotations = this._annotations.asReadonly();

  private save(annotations: Annotation[]): void {
    this.storage.set(STORAGE_KEY, annotations);
    this._annotations.set(annotations);
  }

  create(annotation: Omit<Annotation, 'id' | 'createdAt'>): Annotation {
    const newAnnotation: Annotation = {
      ...annotation,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    this.save([...this._annotations(), newAnnotation]);
    return newAnnotation;
  }

  update(id: string, note: string, color: string): Annotation | null {
    const annotations = this._annotations();
    const annotation = annotations.find((a) => a.id === id);

    if (!annotation) return null;

    const updated: Annotation = { ...annotation, note, color };
    this.save(annotations.map((a) => (a.id === id ? updated : a)));
    return updated;
  }

  delete(id: string): void {
    this.save(this._annotations().filter((a) => a.id !== id));
  }

  deleteForArticle(articleId: string): void {
    this.save(this._annotations().filter((a) => a.articleId !== articleId));
  }
}
