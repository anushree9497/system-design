import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export interface DesignSystemConfig {
  theme?: 'light' | 'dark';
  prefix?: string;
}

export function provideDesignSystem(
  config: DesignSystemConfig = {}
): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAnimationsAsync(),
    { provide: 'DS_CONFIG', useValue: { theme: 'light', prefix: 'ds', ...config } },
  ]);
}
