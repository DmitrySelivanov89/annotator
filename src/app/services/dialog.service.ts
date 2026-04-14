import { ApplicationRef, createComponent, EnvironmentInjector, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Annotation } from '../models/annotation';
import { AnnotationDialog, AnnotationDialogResult } from '../components/annotation-dialog/annotation-dialog';
import { ConfirmDialog } from '../components/shared/confirm-dialog/confirm-dialog';

export interface AnnotationDialogConfig {
  readonly selectedText: string;
  readonly editingAnnotation: Annotation | null;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);

  openAnnotationDialog(config: AnnotationDialogConfig): Observable<AnnotationDialogResult | 'delete' | null> {
    return new Observable((observer) => {
      const hostEl = document.createElement('div');
      document.body.appendChild(hostEl);

      const ref = createComponent(AnnotationDialog, {
        environmentInjector: this.injector,
        hostElement: hostEl,
      });

      ref.setInput('visible', true);
      ref.setInput('selectedText', config.selectedText);
      ref.setInput('editingAnnotation', config.editingAnnotation);

      this.appRef.attachView(ref.hostView);
      ref.changeDetectorRef.detectChanges();

      const confirmSub = ref.instance.confirm.subscribe((result: AnnotationDialogResult) => {
        observer.next(result);
        observer.complete();
        cleanup();
      });

      const cancelSub = ref.instance.cancel.subscribe(() => {
        observer.next(null);
        observer.complete();
        cleanup();
      });

      const deleteSub = ref.instance.deleteAnnotation.subscribe(() => {
        observer.next('delete');
        observer.complete();
        cleanup();
      });

      function cleanup() {
        confirmSub.unsubscribe();
        cancelSub.unsubscribe();
        deleteSub.unsubscribe();
        ref.destroy();
        hostEl.remove();
      }

      return () => cleanup();
    });
  }

  openConfirm(title: string, message: string): Observable<boolean> {
    return new Observable((observer) => {
      const hostEl = document.createElement('div');
      document.body.appendChild(hostEl);

      const ref = createComponent(ConfirmDialog, {
        environmentInjector: this.injector,
        hostElement: hostEl,
      });

      ref.setInput('title', title);
      ref.setInput('message', message);

      this.appRef.attachView(ref.hostView);
      ref.changeDetectorRef.detectChanges();

      const confirmedSub = ref.instance.confirmed.subscribe(() => {
        observer.next(true);
        observer.complete();
        cleanup();
      });

      const cancelledSub = ref.instance.cancelled.subscribe(() => {
        observer.next(false);
        observer.complete();
        cleanup();
      });

      function cleanup() {
        confirmedSub.unsubscribe();
        cancelledSub.unsubscribe();
        ref.destroy();
        hostEl.remove();
      }

      return () => cleanup();
    });
  }
}
