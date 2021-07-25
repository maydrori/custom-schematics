import { DirEntry, SchematicsException, Tree } from '@angular-devkit/schematics';
import { Schema } from '../models/schema.model';
import { findModule } from '@schematics/angular/utility/find-module';
import { strings } from '@angular-devkit/core';

export function getComponentDirPath(options: Schema): string {
  return `${options.path}/${strings.dasherize(options.name)}`;
}

export function getComponentFilePath(options: Schema, ext: string): string {
  return `${getComponentDirPath(options)}/${strings.dasherize(options.name)}.component.${ext}`;
}

export function getComponentModulePath(tree: Tree, options: Schema): string {
  const componentDir: DirEntry = tree.getDir(getComponentDirPath(options));
  const componentDirParentPath = componentDir?.parent?.path;
  if (!componentDirParentPath) {
    throw new SchematicsException('Cant find component parent directory');
  }
  return findModule(tree, componentDirParentPath.toString());
}
