import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ComponentProp } from '../../models/component.model';

@Component({
  selector: 'app-live-preview',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="live-preview">
      <div class="preview-header">
        <mat-icon>visibility</mat-icon>
        <span>Live Preview</span>
        <div class="preview-controls">
          <button class="control-btn" [class.active]="bgMode === 'light'" (click)="bgMode = 'light'">
            Light
          </button>
          <button class="control-btn" [class.active]="bgMode === 'dark'" (click)="bgMode = 'dark'">
            Dark
          </button>
        </div>
      </div>
      <div class="preview-canvas" [class.dark]="bgMode === 'dark'">
        <div class="preview-content" [innerHTML]="renderedHtml"></div>
      </div>
      <div class="preview-info">
        <p *ngIf="inputs.length > 0">
          <strong>Props:</strong>
          <span *ngFor="let input of inputs; let last = last">
            {{ input.name }}: {{ input.type }}{{ last ? '' : ', ' }}
          </span>
        </p>
        <p *ngIf="inputs.length === 0" class="no-props">No props defined</p>
      </div>
    </div>
  `,
  styleUrl: './live-preview.component.scss',
})
export class LivePreviewComponent implements OnChanges {
  @Input() code = { typescript: '', template: '', styles: '' };
  @Input() inputs: ComponentProp[] = [];

  bgMode: 'light' | 'dark' = 'light';
  renderedHtml: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['code']) {
      this.renderPreview();
    }
  }

  private renderPreview(): void {
    // Wrap template in scoped styles for preview
    const styledHtml = `
      <style>${this.code.styles}</style>
      <div class="preview-wrapper">${this.code.template}</div>
    `;
    this.renderedHtml = this.sanitizer.bypassSecurityTrustHtml(styledHtml);
  }
}
