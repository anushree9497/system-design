import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTabsModule, MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <div class="code-editor">
      <div class="editor-toolbar">
        <mat-tab-group [(selectedIndex)]="activeTab" (selectedIndexChange)="onTabChange($event)">
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>code</mat-icon> TypeScript
            </ng-template>
          </mat-tab>
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>html</mat-icon> Template
            </ng-template>
          </mat-tab>
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>palette</mat-icon> Styles
            </ng-template>
          </mat-tab>
        </mat-tab-group>

        <div class="toolbar-actions">
          <button mat-icon-button matTooltip="Format Code" (click)="formatCode()">
            <mat-icon>auto_fix_high</mat-icon>
          </button>
          <button mat-icon-button matTooltip="Reset to Default" (click)="resetCode()">
            <mat-icon>restart_alt</mat-icon>
          </button>
        </div>
      </div>

      <div class="editor-container">
        <textarea
          class="code-textarea"
          [class.lang-typescript]="activeTab === 0"
          [class.lang-html]="activeTab === 1"
          [class.lang-scss]="activeTab === 2"
          [(ngModel)]="currentCode"
          (ngModelChange)="onCodeEdit($event)"
          spellcheck="false"
          [placeholder]="getPlaceholder()"
        ></textarea>
        <div class="editor-footer">
          <span class="lang-label">{{ getLanguageLabel() }}</span>
          <span class="line-count">{{ getLineCount() }} lines</span>
        </div>
      </div>
    </div>
  `,
  styleUrl: './code-editor.component.scss',
})
export class CodeEditorComponent implements OnInit {
  @Input() initialCode = {
    typescript: '',
    template: '',
    styles: '',
  };

  @Output() codeChange = new EventEmitter<{ typescript: string; template: string; styles: string }>();

  activeTab = 0;
  currentCode = '';

  private code = { typescript: '', template: '', styles: '' };

  ngOnInit(): void {
    this.code = { ...this.initialCode };
    this.currentCode = this.code.typescript;
  }

  onTabChange(index: number): void {
    this.saveCurrentTab();
    this.activeTab = index;
    switch (index) {
      case 0: this.currentCode = this.code.typescript; break;
      case 1: this.currentCode = this.code.template; break;
      case 2: this.currentCode = this.code.styles; break;
    }
  }

  onCodeEdit(value: string): void {
    this.saveCurrentTab();
    this.codeChange.emit({ ...this.code });
  }

  formatCode(): void {
    // Basic formatting — in production, use prettier via API
    this.currentCode = this.currentCode
      .split('\n')
      .map(line => line.trimEnd())
      .join('\n');
  }

  resetCode(): void {
    switch (this.activeTab) {
      case 0: this.currentCode = this.initialCode.typescript; break;
      case 1: this.currentCode = this.initialCode.template; break;
      case 2: this.currentCode = this.initialCode.styles; break;
    }
    this.saveCurrentTab();
    this.codeChange.emit({ ...this.code });
  }

  getPlaceholder(): string {
    switch (this.activeTab) {
      case 0: return 'Write your Angular component TypeScript here...';
      case 1: return 'Write your HTML template here...';
      case 2: return 'Write your SCSS styles here...';
      default: return '';
    }
  }

  getLanguageLabel(): string {
    return ['TypeScript', 'HTML', 'SCSS'][this.activeTab] || '';
  }

  getLineCount(): number {
    return this.currentCode.split('\n').length;
  }

  private saveCurrentTab(): void {
    switch (this.activeTab) {
      case 0: this.code.typescript = this.currentCode; break;
      case 1: this.code.template = this.currentCode; break;
      case 2: this.code.styles = this.currentCode; break;
    }
  }
}
