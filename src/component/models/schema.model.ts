import { Path } from '@angular-devkit/core';

export interface Schema {
  name: string;
  path: string;
  project: string;
  withStore: boolean;
  testingModuleName: string;
  specOnly: boolean;
}

export interface ComponentOptions extends Schema {
  module: Path | undefined;
  testingModuleRelativePath: string;
}
