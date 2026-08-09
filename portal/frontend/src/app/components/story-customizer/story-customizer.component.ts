import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ComponentProp, StoryConfig, ArgTypeConfig } from '../../models/component.model';

@Component({
  selector: 'app-story-customizer',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatCardModule, MatIconModule, MatButtonModule,
    MatSlideToggleModule,
  ],
  template: `
    <div class="story-customizer">
      <mat-card>
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Story Title</mat-label>
            <input matInput [(ngModel)]="config.title"
                   [placeholder]="'Components/' + (componentName | titlecase)"
                   (ngModelChange)="emitConfig()" />
            <mat-hint>Storybook sidebar path (e.g. Components/Button)</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Component Description</mat-label>
            <textarea matInput [(ngModel)]="config.description" rows="2"
                      placeholder="Describe what this component does..."
                      (ngModelChange)="emitConfig()">
            </textarea>
          </mat-form-field>

          <h4>Controls Configuration</h4>
          <p class="hint-text">
            Configure how each prop appears in Storybook's Controls panel.
          </p>

          <div *ngFor="let input of inputs" class="arg-config">
            <span class="arg-name">{{ input.name }}</span>
            <mat-form-field appearance="outline" class="control-select">
              <mat-label>Control Type</mat-label>
              <mat-select [(ngModel)]="argTypes[input.name].control"
                          (ngModelChange)="emitConfig()">
                <mat-option value="text">Text Input</mat-option>
                <mat-option value="boolean">Toggle</mat-option>
                <mat-option value="number">Number</mat-option>
                <mat-option value="select">Dropdown Select</mat-option>
                <mat-option value="color">Color Picker</mat-option>
                <mat-option value="object">JSON Object</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field *ngIf="argTypes[input.name]?.control === 'select'"
                           appearance="outline" class="options-field">
              <mat-label>Options (comma-separated)</mat-label>
              <input matInput
                     [ngModel]="argTypes[input.name]?.options?.join(', ')"
                     (ngModelChange)="updateOptions(input.name, $event)"
                     placeholder="option1, option2, option3" />
            </mat-form-field>
          </div>

          <div *ngIf="inputs.length === 0" class="empty-hint">
            <mat-icon>info</mat-icon>
            <span>Define inputs in the previous step to configure Storybook controls.</span>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Generated Story Preview -->
      <mat-card class="story-preview-card">
        <mat-card-content>
          <div class="preview-header">
            <mat-icon>auto_stories</mat-icon>
            <span>Generated .stories.ts Preview</span>
          </div>
          <pre class="story-code">{{ generatedStory }}</pre>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrl: './story-customizer.component.scss',
})
export class StoryCustomizerComponent implements OnInit, OnChanges {
  @Input() componentName = '';
  @Input() inputs: ComponentProp[] = [];
  @Input() outputs: ComponentProp[] = [];
  @Output() configChange = new EventEmitter<StoryConfig>();

  config: StoryConfig = {
    title: '',
    description: '',
    args: {},
    argTypes: {},
  };

  argTypes: Record<string, ArgTypeConfig> = {};
  generatedStory = '';

  ngOnInit(): void {
    this.updateTitle();
    this.buildArgTypes();
    this.generateStoryPreview();
  }

  ngOnChanges(): void {
    this.updateTitle();
    this.buildArgTypes();
    this.generateStoryPreview();
  }

  emitConfig(): void {
    this.config.argTypes = this.argTypes;
    this.configChange.emit(this.config);
    this.generateStoryPreview();
  }

  updateOptions(propName: string, value: string): void {
    this.argTypes[propName].options = value.split(',').map(s => s.trim()).filter(Boolean);
    this.emitConfig();
  }

  private updateTitle(): void {
    if (!this.config.title && this.componentName) {
      this.config.title = `Components/${this.pascalCase(this.componentName)}`;
    }
  }

  private buildArgTypes(): void {
    for (const input of this.inputs) {
      if (!this.argTypes[input.name]) {
        this.argTypes[input.name] = {
          control: this.inferControl(input.type),
          description: input.description,
        };
      }
    }
  }

  private inferControl(type: string): ArgTypeConfig['control'] {
    switch (type) {
      case 'boolean': return 'boolean';
      case 'number': return 'number';
      case 'string[]': return 'object';
      default: return 'text';
    }
  }

  private generateStoryPreview(): void {
    const className = this.pascalCase(this.componentName) + 'Component';
    const selector = `ds-${this.componentName}`;

    const argsStr = this.inputs
      .map(i => `    ${i.name}: ${i.defaultValue || this.getTypeDefault(i.type)}`)
      .join(',\n');

    const argTypesStr = Object.entries(this.argTypes)
      .map(([key, val]) => {
        let str = `    ${key}: { control: '${val.control}'`;
        if (val.options?.length) {
          str += `, options: [${val.options.map(o => `'${o}'`).join(', ')}]`;
        }
        str += ` }`;
        return str;
      })
      .join(',\n');

    const inputBindings = this.inputs
      .map(i => `[${i.name}]="${i.name}"`)
      .join(' ');

    this.generatedStory = `import type { Meta, StoryObj } from '@storybook/angular';
import { ${className} } from './${this.componentName}.component';

const meta: Meta<${className}> = {
  title: '${this.config.title || 'Components/' + this.pascalCase(this.componentName)}',
  component: ${className},
  tags: ['autodocs'],
  argTypes: {
${argTypesStr}
  },
};

export default meta;
type Story = StoryObj<${className}>;

export const Default: Story = {
  args: {
${argsStr}
  },
  render: (args) => ({
    props: args,
    template: \`<${selector} ${inputBindings}></${selector}>\`,
  }),
};`;
  }

  private pascalCase(str: string): string {
    return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  }

  private getTypeDefault(type: string): string {
    switch (type) {
      case 'string': return "''";
      case 'number': return '0';
      case 'boolean': return 'false';
      default: return 'undefined';
    }
  }
}
