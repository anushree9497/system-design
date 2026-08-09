import { Injectable } from '@nestjs/common';
import { CreateComponentDto } from '../components/dto/create-component.dto';

@Injectable()
export class TemplateService {
  generateComponentFiles(dto: CreateComponentDto): Map<string, string> {
    const files = new Map<string, string>();
    const basePath = `libs/community/src/lib/${dto.name}`;
    const className = this.toPascalCase(dto.name) + 'Component';

    // Component TypeScript file
    files.set(`${basePath}/${dto.name}.component.ts`, dto.code.typescript);

    // Template file
    files.set(`${basePath}/${dto.name}.component.html`, dto.code.template);

    // Styles file
    files.set(`${basePath}/${dto.name}.component.scss`, dto.code.styles);

    // Spec file (auto-generated shell)
    files.set(`${basePath}/${dto.name}.component.spec.ts`, this.generateSpec(dto, className));

    // Stories file
    files.set(`${basePath}/${dto.name}.stories.ts`, this.generateStory(dto, className));

    // Barrel export
    files.set(`${basePath}/index.ts`, `export * from './${dto.name}.component';\n`);

    // README for the component
    files.set(`${basePath}/README.md`, this.generateReadme(dto));

    // Update community library barrel export
    files.set(
      `libs/community/src/lib/${dto.name}-export.ts`,
      `export * from './${dto.name}';\n`
    );

    return files;
  }

  private generateSpec(dto: CreateComponentDto, className: string): string {
    return `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ${className} } from './${dto.name}.component';

describe('${className}', () => {
  let component: ${className};
  let fixture: ComponentFixture<${className}>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [${className}],
    }).compileComponents();

    fixture = TestBed.createComponent(${className});
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

${dto.inputs.map(input => `  it('should have ${input.name} input', () => {
    component.${input.name} = ${this.getTestValue(input.type)};
    fixture.detectChanges();
    expect(component.${input.name}).toBeDefined();
  });
`).join('\n')}

${dto.outputs.map(output => `  it('should emit ${output.name}', () => {
    const spy = jest.fn();
    component.${output.name}.subscribe(spy);
    // TODO: trigger the output
    // expect(spy).toHaveBeenCalled();
  });
`).join('\n')}
});
`;
  }

  private generateStory(dto: CreateComponentDto, className: string): string {
    const storyTitle = dto.storyConfig?.title || `Community/${this.toPascalCase(dto.name)}`;

    const argsStr = dto.inputs
      .map(i => `    ${i.name}: ${i.defaultValue || this.getDefaultForType(i.type)},`)
      .join('\n');

    const argTypesStr = dto.inputs
      .map(i => {
        const control = this.inferControl(i.type);
        return `    ${i.name}: { control: '${control}', description: '${i.description}' },`;
      })
      .join('\n');

    const bindings = dto.inputs
      .map(i => `[${i.name}]="${i.name}"`)
      .join(' ');

    return `import type { Meta, StoryObj } from '@storybook/angular';
import { ${className} } from './${dto.name}.component';

const meta: Meta<${className}> = {
  title: '${storyTitle}',
  component: ${className},
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '${dto.description.replace(/'/g, "\\'")}',
      },
    },
  },
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
    template: \`<${dto.selector} ${bindings}></${dto.selector}>\`,
  }),
};

export const Playground: Story = {
  args: {
${argsStr}
  },
};
`;
  }

  private generateReadme(dto: CreateComponentDto): string {
    return `# ${this.toPascalCase(dto.name)}

${dto.description}

## Usage

\`\`\`html
<${dto.selector}></${dto.selector}>
\`\`\`

## Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
${dto.inputs.map(i => `| \`${i.name}\` | \`${i.type}\` | \`${i.defaultValue || '-'}\` | ${i.description} |`).join('\n')}

## Outputs

| Name | Type | Description |
|------|------|-------------|
${dto.outputs.map(o => `| \`${o.name}\` | \`${o.type}\` | ${o.description} |`).join('\n')}

## Author

Contributed by **${dto.author.name}** ([@${dto.author.github}](https://github.com/${dto.author.github}))
`;
  }

  private toPascalCase(str: string): string {
    return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  }

  private inferControl(type: string): string {
    switch (type) {
      case 'boolean': return 'boolean';
      case 'number': return 'number';
      case 'string[]': return 'object';
      default: return 'text';
    }
  }

  private getDefaultForType(type: string): string {
    switch (type) {
      case 'string': return "''";
      case 'number': return '0';
      case 'boolean': return 'false';
      default: return 'undefined';
    }
  }

  private getTestValue(type: string): string {
    switch (type) {
      case 'string': return "'test'";
      case 'number': return '42';
      case 'boolean': return 'true';
      default: return "'test'";
    }
  }
}
