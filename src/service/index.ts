import {
  apply,
  applyTemplates,
  chain,
  externalSchematic,
  MergeStrategy,
  mergeWith, move,
  Rule, Tree,
  url
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { ServiceOptions } from './models/service-options.model';
import { setProjectOptions } from '../helpers/set-project-options';

export function service(serviceOptions: ServiceOptions): Rule {
  return async (tree: Tree) => {
    const options = await setProjectOptions(tree, serviceOptions);

    const templateSource = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        ...serviceOptions,
      }),
      move(options.path)
    ]);

    return chain([
      externalSchematic('@schematics/angular', 'service', {
        name: options.name,
        project: options.project,
        path: options.path,
      }),
      mergeWith(templateSource, MergeStrategy.Overwrite)
    ]);
  };
}
