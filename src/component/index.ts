import { Rule, Tree } from '@angular-devkit/schematics';
import { setProjectOptions } from '../helpers/set-project-options';
import { Schema } from './models/schema.model';
import { deleteComponentRule } from './rules/delete-component.rule';
import { renameComponentRule } from './rules/rename-component.rule';
import { createComponentRule } from './rules/create-component.rule';

export function component(options: Schema): Rule {
  return async (tree: Tree) => {
    await setProjectOptions(tree, options);
    if (options.delete) {
      return deleteComponentRule(options);
    } else if (options.rename) {
      return renameComponentRule(options);
    } else {
      return createComponentRule(options);
    }
  };
}

