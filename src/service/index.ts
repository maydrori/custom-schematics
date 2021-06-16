import {
  apply,
  applyTemplates,
  MergeStrategy, mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url
} from '@angular-devkit/schematics';
import { setProjectOptions } from '../helpers/set-project-options';
import { strings } from '@angular-devkit/core';

export function service(_options: any): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const options = await setProjectOptions(tree, _options);

    const templateSource = apply(url('./files'), [
      applyTemplates({
        ...strings,
        ...options,
      }),
      move(options.path),
    ]);

    return mergeWith(templateSource, MergeStrategy.Default);
  };
}
