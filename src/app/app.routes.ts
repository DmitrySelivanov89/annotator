import { Routes } from '@angular/router';
import { EmptyState } from './components/empty-state/empty-state';
import { ArticleViewer } from './components/article-viewer/article-viewer';
import { ArticleEditor } from './components/article-editor/article-editor';

export const routes: Routes = [
  { path: '', component: EmptyState },
  { path: 'articles/new', component: ArticleEditor },
  { path: 'articles/:id', component: ArticleViewer },
  { path: 'articles/:id/edit', component: ArticleEditor },
  { path: '**', redirectTo: '' },
];
