import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { ArticleList } from './components/article-list/article-list';

@Component({
  selector: 'app-root',
  imports: [ArticleList, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly router = inject(Router);

  protected readonly selectedArticleId = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.router.routerState.snapshot.root.firstChild?.params['id']),
    ),
  );

  onSelectArticle(id: string): void {
    this.router.navigate(['/articles', id]);
  }

  onCreateNew(): void {
    this.router.navigate(['/articles/new']);
  }
}
