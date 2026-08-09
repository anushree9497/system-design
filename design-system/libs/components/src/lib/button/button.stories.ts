import type { Meta, StoryObj } from '@storybook/angular';
import { DsButtonComponent } from './button.component';

const meta: Meta<DsButtonComponent> = {
  title: 'Components/Button',
  component: DsButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      description: 'Visual style of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    icon: { control: 'text', description: 'Material icon name' },
  },
};

export default meta;
type Story = StoryObj<DsButtonComponent>;

export const Primary: Story = {
  args: { variant: 'primary', size: 'md' },
  render: (args) => ({
    props: args,
    template: `<ds-button [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading" [icon]="icon">Click Me</ds-button>`,
  }),
};

export const Secondary: Story = {
  args: { variant: 'secondary', size: 'md' },
  render: (args) => ({
    props: args,
    template: `<ds-button [variant]="variant" [size]="size">Secondary</ds-button>`,
  }),
};

export const Outline: Story = {
  args: { variant: 'outline', size: 'md' },
  render: (args) => ({
    props: args,
    template: `<ds-button [variant]="variant" [size]="size">Outline</ds-button>`,
  }),
};

export const WithIcon: Story = {
  args: { variant: 'primary', size: 'md', icon: 'send' },
  render: (args) => ({
    props: args,
    template: `<ds-button [variant]="variant" [size]="size" [icon]="icon">Send</ds-button>`,
  }),
};

export const Loading: Story = {
  args: { variant: 'primary', size: 'md', loading: true },
  render: (args) => ({
    props: args,
    template: `<ds-button [variant]="variant" [size]="size" [loading]="loading">Submitting...</ds-button>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <ds-button variant="primary">Primary</ds-button>
        <ds-button variant="secondary">Secondary</ds-button>
        <ds-button variant="outline">Outline</ds-button>
        <ds-button variant="ghost">Ghost</ds-button>
        <ds-button variant="danger">Danger</ds-button>
      </div>
    `,
  }),
};
