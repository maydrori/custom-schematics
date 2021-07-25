import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { createSourceFile, Node, ScriptTarget, SourceFile, SyntaxKind } from 'typescript';
import { getSourceNodes } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';

export function getTsSourceFile(tree: Tree, filePath: string): SourceFile {
  const fileText = tree.read(filePath);
  if (!fileText){
    throw new SchematicsException(`File ${filePath} not found`);
  }
  const sourceText = fileText.toString('utf-8');
  return createSourceFile(filePath, sourceText, ScriptTarget.Latest, true);
}

export function getObjectEndPosition(sourceFile: SourceFile, objectName: string): number {
  // @ts-ignore
  const nodes: Node[] = getSourceNodes(sourceFile);
  const objectRoot = nodes.find(n => n.kind === SyntaxKind.Identifier && n.getText() === objectName);
  if (!objectRoot) {
    throw new SchematicsException(`Object ${objectName} not found`);
  }

  let objectSiblings = objectRoot.parent.getChildren();
  const rootObjectIndex = objectSiblings.indexOf(objectRoot);
  objectSiblings = objectSiblings.slice(rootObjectIndex);

  const objectLiteralExpressionNode = objectSiblings.find(n => n.kind === SyntaxKind.ObjectLiteralExpression);
  if (!objectLiteralExpressionNode) {
    throw new SchematicsException(`ObjectLiteralExpression node is not defined`);
  }

  const objectNode = objectLiteralExpressionNode.getChildren().find(n => n.kind === SyntaxKind.SyntaxList);
  if (!objectNode) {
    throw new SchematicsException(`Object node is not defined`);
  }

  return objectNode.end;
}

export function getArrayElementPosition(sourceFile: SourceFile, arrayName: string, element: string): [number, number] {
  // @ts-ignore
  const nodes: Node[] = getSourceNodes(sourceFile);
  const arrayNode = nodes.find(n => n.kind === SyntaxKind.Identifier && n.getText() === arrayName);
  if (!arrayNode) {
    throw new SchematicsException(`Array ${arrayName} not found`);
  }

  const arrayLiteralExpression = arrayNode.parent.getChildren().find(n => n.kind === SyntaxKind.ArrayLiteralExpression);
  if (!arrayLiteralExpression) {
    throw new SchematicsException(`ArrayLiteralExpression node is not defined`);
  }

  const arrayElements = arrayLiteralExpression.getChildren().find(n => n.kind === SyntaxKind.SyntaxList);
  if (!arrayElements) {
    throw new SchematicsException(`arrayElements is not defined`);
  }

  let start: number;
  let end: number;
  arrayElements.getChildren().forEach((n, i) => {
    if (n.kind === SyntaxKind.Identifier && n.getText() === element) {
      start = n.pos;
      end = n.end;
    }
    if (arrayElements.getChildren()[i + 1]?.kind === SyntaxKind.CommaToken) {
      end++;
    }
  });
  // @ts-ignore
  return [start, end];
}

export function performInsertChange(tree: Tree, filePath: string, pos: number, content: string): void {
  const change = new InsertChange(filePath, pos, content);
  const declarationRecorder = tree.beginUpdate(filePath);
  declarationRecorder.insertLeft(change.pos, change.toAdd);
  tree.commitUpdate(declarationRecorder);
}
