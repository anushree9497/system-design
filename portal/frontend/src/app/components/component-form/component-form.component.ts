import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

import { CodeEditorComponent } from '../code-editor/code-editor.component';
import { PropBuilderComponent } from '../prop-builder/prop-builder.component';
import { LivePreviewComponent } from '../live-preview/live-preview.component';
import { StoryCustomizerComponent } from '../story-customizer/story-customizer.component';
import { ComponentService } from '../../services/component.service';
import { ComponentSubmission, ComponentCategory } from '../../models/component.model';

@Component({
  selector: 'app-component-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatTabsModule,
    MatCheckboxModule,
    MatDividerModule,
    MatCardModule,
    CodeEditorComponent,
    PropBuilderComponent,
    LivePreviewComponent,
    StoryCustomizerComponent,
  ],
  templateUrl: './component-form.component.html',
  styleUrl: './component-form.component.scss',
})
export class ComponentFormComponent {
  metadataForm: FormGroup;
  authorForm: FormGroup;
  submitting = false;

  componentCode = {
    typescript: this.getDefaultTypeScript(),
    template: '<div class="my-component">\n  <p>Hello from my component!</p>\n</div>',
    styles: '.my-component {\n  padding: 16px;\n  border-radius: 8px;\n}',
  };

  categories: ComponentCategory[] = [
    'buttons', 'cards', 'inputs', 'layout',
    'navigation', 'feedback', 'data-display', 'overlays', 'other',
  ];

  constructor(
    private fb: FormBuilder,
    private componentService: ComponentService,
    private snackBar: MatSnackBar
  ) {
    this.metadataForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-z][a-z0-9-]*$/)]],
      selector: ['', [Validators.required, Validators.pattern(/^[a-z]+-[a-z0-9-]+$/)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      category: ['', Validators.required],
    });

    this.authorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      github: ['', Validators.required],
    });

    this.metadataForm.get('name')?.valueChanges.subscribe((name: string) => {
      if (name) {
        const selector = `ds-${name}`;
        this.metadataForm.patchValue({ selector }, { emitEvent: false });
      }
    });
  }

  inputs: any[] = [];
  outputs: any[] = [];
  storyConfig: any = {};

  onInputsChange(inputs: any[]): void {
    this.inputs = inputs;
  }

  onOutputsChange(outputs: any[]): void {
    this.outputs = outputs;
  }

  onStoryConfigChange(config: any): void {
    this.storyConfig = config;
  }

  onCodeChange(code: { typescript: string; template: string; styles: string }): void {
    this.componentCode = code;
  }

  async submit(): Promise<void> {
    if (this.metadataForm.invalid || this.authorForm.invalid) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.submitting = true;

    const submission: ComponentSubmission = {
      ...this.metadataForm.value,
      inputs: this.inputs,
      outputs: this.outputs,
      code: this.componentCode,
      storyConfig: this.storyConfig,
      author: this.authorForm.value,
    };

    this.componentService.submit(submission).subscribe({
      next: (response) => {
        this.submitting = false;
        if (response.success) {
          this.snackBar.open(`PR created successfully! ${response.prUrl}`, 'Open PR', {
            duration: 10000,
          });
        } else {
          this.snackBar.open(`Submission failed: ${response.message}`, 'Close', {
            duration: 5000,
          });
        }
      },
      error: (err) => {
        this.submitting = false;
        this.snackBar.open('An error occurred. Please try again.', 'Close', { duration: 5000 });
      },
    });
  }

  private getDefaultTypeScript(): string {
    return `import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ds-my-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-component.component.html',
  styleUrl: './my-component.component.scss',
})
export class MyComponentComponent {
  @Input() title = 'Hello';
}`;
  }
}
