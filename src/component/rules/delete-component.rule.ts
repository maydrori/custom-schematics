import { Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import { getSourceNodes } from '@schematics/angular/utility/ast-utils';
import { Node, SourceFile, SyntaxKind } from 'typescript';
import { classify } from '@angular-devkit/core/src/utils/strings';
import { Schema } from '../models/schema.model';
import { getArrayElementPosition, getTsSourceFile } from '../../helpers/update-file.helper';
import { getComponentDirPath, getComponentModulePath } from '../helpers/component-helpers';

export function deleteComponentRule(options: Schema): Rule {
  return (tree: Tree) => {
    deleteComponentFiles(tree, options);
    deleteComponentRefs(tree, options);
    return tree;
  };
}

function deleteComponentFiles(tree: Tree, options: Schema): void {
  tree.delete(getComponentDirPath(options));
}

function deleteComponentRefs(tree: Tree, options: Schema): void {
  const modulePath = getComponentModulePath(tree, options);
  const moduleSourceFile = getTsSourceFile(tree, modulePath);
  const componentName = `${classify(options.name)}Component`;

  const componentImportNode = getImportNode(moduleSourceFile, componentName);
  const [componentDeclarationStart, componentDeclarationEnd] = getDeclarationPosition(moduleSourceFile, componentName);

  const declarationRecorder = tree.beginUpdate(modulePath);
  declarationRecorder.remove(componentImportNode.pos, componentImportNode.end - componentImportNode.pos);
  declarationRecorder.remove(componentDeclarationStart, componentDeclarationEnd - componentDeclarationStart);
  tree.commitUpdate(declarationRecorder);
}

function getImportNode(moduleSourceFile: SourceFile, componentName: string): Node {
  // @ts-ignore
  const nodes: Node[] = getSourceNodes(moduleSourceFile);
  const importDeclaration =
      nodes.find(n => n.kind === SyntaxKind.ImportDeclaration && n.getText().includes(componentName));
  if (!importDeclaration) {
    throw new SchematicsException(`Cant find your component import in the module`);
  }
  return importDeclaration;
}

function getDeclarationPosition(moduleSourceFile: SourceFile, componentName: string): [number, number] {
  return getArrayElementPosition(moduleSourceFile, 'declarations', componentName);
}
