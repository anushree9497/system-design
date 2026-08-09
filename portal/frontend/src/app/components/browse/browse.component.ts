import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

interface ComponentEntry {
  name: string;
  description: string;
  category: string;
  author: string;
  status: 'approved' | 'pending' | 'review';
}

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatChipsModule, MatIconModule,
    MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule,
  ],
  template: `
    <div class="browse-page">
      <h1>Component Registry</h1>
      <p class="subtitle">Browse all contributed components in the design system.</p>

      <div class="search-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search components</mat-label>
          <input matInput [(ngModel)]="searchQuery" placeholder="e.g. button, card..." />
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
      </div>

      <div class="category-chips">
        <mat-chip-listbox>
          <mat-chip-option *ngFor="let cat of categories"
                          [selected]="selectedCategory === cat"
                          (click)="selectedCategory = cat">
            {{ cat | titlecase }}
          </mat-chip-option>
        </mat-chip-listbox>
      </div>

      <div class="component-grid">
        <mat-card *ngFor="let comp of filteredComponents" class="component-card">
          <mat-card-header>
            <mat-card-title>{{ comp.name | titlecase }}</mat-card-title>
            <mat-card-subtitle>by {{ comp.author }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ comp.description }}</p>
            <div class="card-meta">
              <span class="category-badge">{{ comp.category }}</span>
              <span class="status-badge" [class]="'status--' + comp.status">
                {{ comp.status }}
              </span>
            </div>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-button color="primary">
              <mat-icon>auto_stories</mat-icon> View in Storybook
            </button>
            <button mat-button>
              <mat-icon>code</mat-icon> Source
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .browse-page {
      h1 { font-size: 2rem; margin-bottom: 4px; }
      .subtitle { color: #666; margin-bottom: 24px; }
    }
    .search-bar { margin-bottom: 16px; }
    .search-field { width: 100%; max-width: 500px; }
    .category-chips { margin-bottom: 24px; }
    .component-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }
    .component-card {
      .card-meta {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }
      .category-badge {
        padding: 2px 8px;
        border-radius: 4px;
        background: #e3f2fd;
        color: #1976d2;
        font-size: 12px;
      }
      .status-badge {
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        &.status--approved { background: #e8f5e9; color: #2e7d32; }
        &.status--pending { background: #fff3e0; color: #ef6c00; }
        &.status--review { background: #fce4ec; color: #c62828; }
      }
    }
  `],
})
export class BrowseComponent {
  searchQuery = '';
  selectedCategory = '';

  categories = ['all', 'buttons', 'cards', 'inputs', 'layout', 'navigation', 'feedback'];

  components: ComponentEntry[] = [
    { name: 'ds-button', description: 'Multi-variant button with loading states and icon support', category: 'buttons', author: 'core-team', status: 'approved' },
    { name: 'ds-card', description: 'Flexible card component with elevated, outlined, and filled variants', category: 'cards', author: 'core-team', status: 'approved' },
    { name: 'ds-input', description: 'Form input with prefix/suffix icons, hints, and validation', category: 'inputs', author: 'core-team', status: 'approved' },
    { name: 'ds-avatar', description: 'User avatar with image, initials, or icon fallback', category: 'data-display', author: 'contributor-1', status: 'pending' },
    { name: 'ds-badge', description: 'Status badge with color variants and dot mode', category: 'feedback', author: 'contributor-2', status: 'review' },
  ];

  get filteredComponents(): ComponentEntry[] {
    return this.components.filter(c => {
      const matchesSearch = !this.searchQuery ||
        c.name.includes(this.searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = !this.selectedCategory || this.selectedCategory === 'all' ||
        c.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }
}
