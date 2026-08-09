import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

export type DsCardVariant = 'elevated' | 'outlined' | 'filled';

@Component({
  selector: 'ds-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card [class]="'ds-card ds-card--' + variant" [class.ds-card--clickable]="clickable">
      <mat-card-header *ngIf="title">
        <mat-card-title>{{ title }}</mat-card-title>
        <mat-card-subtitle *ngIf="subtitle">{{ subtitle }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <ng-content></ng-content>
      </mat-card-content>
      <mat-card-actions *ngIf="showActions" align="end">
        <ng-content select="[dsCardActions]"></ng-content>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrl: './card.component.scss',
})
export class DsCardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() variant: DsCardVariant = 'elevated';
  @Input() clickable = false;
  @Input() showActions = false;
}
