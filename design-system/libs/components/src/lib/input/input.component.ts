import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type DsInputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'url';

@Component({
  selector: 'ds-input',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  template: `
    <mat-form-field [appearance]="'outline'" class="ds-input" [class.ds-input--full-width]="fullWidth">
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [required]="required"
        [value]="value"
        (input)="onInput($event)"
      />
      <mat-icon *ngIf="prefixIcon" matPrefix>{{ prefixIcon }}</mat-icon>
      <mat-icon *ngIf="suffixIcon" matSuffix>{{ suffixIcon }}</mat-icon>
      <mat-hint *ngIf="hint">{{ hint }}</mat-hint>
      <mat-error *ngIf="error">{{ error }}</mat-error>
    </mat-form-field>
  `,
  styleUrl: './input.component.scss',
})
export class DsInputComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: DsInputType = 'text';
  @Input() value = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() fullWidth = false;
  @Input() hint?: string;
  @Input() error?: string;
  @Input() prefixIcon?: string;
  @Input() suffixIcon?: string;

  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }
}
