import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

export type DsButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type DsButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ds-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <button
      [class]="'ds-button ds-button--' + variant + ' ds-button--' + size"
      [disabled]="disabled || loading"
      [attr.aria-busy]="loading"
    >
      <mat-spinner *ngIf="loading" diameter="16" class="ds-button__spinner"></mat-spinner>
      <mat-icon *ngIf="icon && !loading" class="ds-button__icon">{{ icon }}</mat-icon>
      <span class="ds-button__label">
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styleUrl: './button.component.scss',
})
export class DsButtonComponent {
  @Input() variant: DsButtonVariant = 'primary';
  @Input() size: DsButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon?: string;
}
