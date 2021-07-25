import { Schema } from '../models/schema.model';
import { chain, move, Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';
import { getComponentModulePath } from '../helpers/component-helpers';

export function renameComponentRule(options: Schema): Rule {
  return () => {
    const componentOldFolder = `${options.path}/${strings.dasherize(options.name)}`;
    const componentNewFolder = `${options.path}/${strings.dasherize(options.rename)}`;

    return chain([
      renameComponentRefsInFile(options, 'ts'),
      renameComponentRefsInFile(options, 'spec.ts'),
      renameComponentRefsInFile(options, 'html'),
      renameComponentRefsInFile(options, 'scss'),
      renameComponentRefsInModule(options),
      move(componentOldFolder, componentNewFolder),
    ]);
  };
}

export function renameComponentRefsInFile(options: Schema, ext: string): Rule {
  return (tree: Tree) => {
    const oldFilePath = `${options.path}/${strings.dasherize(options.name)}/${strings.dasherize(options.name)}.component.${ext}`;
    const newFilePath = `${options.path}/${strings.dasherize(options.name)}/${strings.dasherize(options.rename)}.component.${ext}`;

    tree.create(newFilePath, getFileWithUpdatedRefs(tree, options, oldFilePath));
    tree.delete(oldFilePath);
    return tree;
  };
}

export function renameComponentRefsInModule(options: Schema): Rule {
  return (tree: Tree) => {
    const modulePath = getComponentModulePath(tree, options);
    tree.overwrite(modulePath, getFileWithUpdatedRefs(tree, options, modulePath));
    return tree;
  };
}

export function getFileWithUpdatedRefs(tree: Tree, options: Schema, filePath: string): string {
  const fileText = tree.read(filePath);
  if (!fileText) {
    throw new SchematicsException(`File ${filePath} not found`);
  }

  const sourceText = fileText.toString('utf-8');
  const componentClassNameRegex = new RegExp(`${classify(options.name)}Component`, 'g');
  const componentFileNameRegex = new RegExp(dasherize(options.name), 'g');
  return sourceText
      .replace(componentClassNameRegex, `${classify(options.rename)}Component`)
      .replace(componentFileNameRegex, `${dasherize(options.rename)}`);
}
