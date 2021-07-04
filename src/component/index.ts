import {
  apply,
  applyTemplates,
  chain,
  externalSchematic,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  Tree,
  url
} from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';
import { setProjectOptions } from '../helpers/set-project-options';

export function component(_options: any): Rule {
  return async (tree: Tree) => {
    const options = await setProjectOptions(tree, _options);
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
        name: _options.name,
        project: _options.project,
        path: _options.path,
      }),
      mergeWith(templateSource, MergeStrategy.Overwrite)
    ]);
  };
}

