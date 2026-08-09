import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <mat-icon>widgets</mat-icon>
      <span class="app-title">Design System Portal</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/submit">
        <mat-icon>add</mat-icon> Submit Component
      </button>
      <button mat-button routerLink="/browse">
        <mat-icon>search</mat-icon> Browse
      </button>
    </mat-toolbar>
    <main class="app-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .app-title {
      margin-left: 12px;
      font-weight: 500;
    }
    .spacer {
      flex: 1;
    }
    .app-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px 24px;
    }
  `],
})
export class AppComponent {}
