export interface ComponentSubmission {
  name: string;
  selector: string;
  description: string;
  category: ComponentCategory;
  inputs: ComponentProp[];
  outputs: ComponentProp[];
  code: ComponentCode;
  storyConfig: StoryConfig;
  author: AuthorInfo;
}

export type ComponentCategory =
  | 'buttons'
  | 'cards'
  | 'inputs'
  | 'layout'
  | 'navigation'
  | 'feedback'
  | 'data-display'
  | 'overlays'
  | 'other';

export interface ComponentProp {
  name: string;
  type: string;
  defaultValue?: string;
  required: boolean;
  description: string;
}

export interface ComponentCode {
  typescript: string;
  template: string;
  styles: string;
}

export interface StoryConfig {
  title: string;
  description: string;
  args: Record<string, unknown>;
  argTypes: Record<string, ArgTypeConfig>;
}

export interface ArgTypeConfig {
  control: 'text' | 'boolean' | 'number' | 'select' | 'color' | 'object';
  options?: string[];
  description?: string;
}

export interface AuthorInfo {
  name: string;
  email: string;
  github: string;
}

export interface SubmissionResponse {
  success: boolean;
  prUrl?: string;
  message: string;
  errors?: string[];
}
