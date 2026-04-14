import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.html',
  styleUrls: ['./empty-state.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  private readonly router = inject(Router);

  createNew(): void {
    this.router.navigate(['/articles/new']);
  }
}
