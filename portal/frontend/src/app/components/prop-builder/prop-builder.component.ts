import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ComponentProp } from '../../models/component.model';

@Component({
  selector: 'app-prop-builder',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatCheckboxModule,
    MatCardModule, MatChipsModule, MatDividerModule,
  ],
  template: `
    <div class="prop-builder">
      <!-- INPUTS Section -->
      <div class="section">
        <div class="section-header">
          <h3>@Input() Properties</h3>
          <button mat-mini-fab color="primary" (click)="addInput()">
            <mat-icon>add</mat-icon>
          </button>
        </div>

        <div *ngIf="inputs.length === 0" class="empty-state">
          <mat-icon>input</mat-icon>
          <p>No inputs defined yet. Click + to add one.</p>
        </div>

        <mat-card *ngFor="let input of inputs; let i = index" class="prop-card">
          <mat-card-content>
            <div class="prop-row">
              <mat-form-field appearance="outline" class="prop-field">
                <mat-label>Name</mat-label>
                <input matInput [(ngModel)]="input.name" placeholder="e.g. title" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="prop-field">
                <mat-label>Type</mat-label>
                <mat-select [(ngModel)]="input.type">
                  <mat-option value="string">string</mat-option>
                  <mat-option value="number">number</mat-option>
                  <mat-option value="boolean">boolean</mat-option>
                  <mat-option value="string[]">string[]</mat-option>
                  <mat-option value="object">object</mat-option>
                  <mat-option value="custom">custom (type in default)</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="prop-field">
                <mat-label>Default Value</mat-label>
                <input matInput [(ngModel)]="input.defaultValue" placeholder="e.g. 'Hello'" />
              </mat-form-field>

              <mat-checkbox [(ngModel)]="input.required">Required</mat-checkbox>

              <button mat-icon-button color="warn" (click)="removeInput(i)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>

            <mat-form-field appearance="outline" class="prop-description">
              <mat-label>Description</mat-label>
              <input matInput [(ngModel)]="input.description"
                     placeholder="What does this input do?" />
            </mat-form-field>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-divider></mat-divider>

      <!-- OUTPUTS Section -->
      <div class="section">
        <div class="section-header">
          <h3>@Output() Events</h3>
          <button mat-mini-fab color="accent" (click)="addOutput()">
            <mat-icon>add</mat-icon>
          </button>
        </div>

        <div *ngIf="outputs.length === 0" class="empty-state">
          <mat-icon>output</mat-icon>
          <p>No outputs defined yet. Click + to add one.</p>
        </div>

        <mat-card *ngFor="let output of outputs; let i = index" class="prop-card">
          <mat-card-content>
            <div class="prop-row">
              <mat-form-field appearance="outline" class="prop-field">
                <mat-label>Event Name</mat-label>
                <input matInput [(ngModel)]="output.name" placeholder="e.g. clicked" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="prop-field">
                <mat-label>Payload Type</mat-label>
                <input matInput [(ngModel)]="output.type" placeholder="e.g. MouseEvent" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="prop-field">
                <mat-label>Description</mat-label>
                <input matInput [(ngModel)]="output.description"
                       placeholder="When is this emitted?" />
              </mat-form-field>

              <button mat-icon-button color="warn" (click)="removeOutput(i)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styleUrl: './prop-builder.component.scss',
})
export class PropBuilderComponent {
  @Output() inputsChange = new EventEmitter<ComponentProp[]>();
  @Output() outputsChange = new EventEmitter<ComponentProp[]>();

  inputs: ComponentProp[] = [];
  outputs: ComponentProp[] = [];

  addInput(): void {
    this.inputs.push({
      name: '',
      type: 'string',
      defaultValue: '',
      required: false,
      description: '',
    });
    this.inputsChange.emit(this.inputs);
  }

  removeInput(index: number): void {
    this.inputs.splice(index, 1);
    this.inputsChange.emit(this.inputs);
  }

  addOutput(): void {
    this.outputs.push({
      name: '',
      type: 'void',
      required: false,
      description: '',
    });
    this.outputsChange.emit(this.outputs);
  }

  removeOutput(index: number): void {
    this.outputs.splice(index, 1);
    this.outputsChange.emit(this.outputs);
  }
}
