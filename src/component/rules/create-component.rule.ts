import { Schema } from '../models/schema.model';
import {
  apply,
  applyTemplates,
  chain,
  externalSchematic,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  url
} from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';

export function createComponentRule(options: Schema): Rule {
  const movePath = normalize(`${options.path}/${strings.dasherize(options.name)}`);

  const templateSource = apply(url('./files'), [
    applyTemplates({
      ...strings,
      ...options,
    }),
    move(movePath),
  ]);

  return chain([
    externalSchematic('@schematics/angular', 'component', {
      name: options.name,
      project: options.project,
      path: options.path,
    }),
    mergeWith(templateSource, MergeStrategy.Overwrite)
  ]);
}
