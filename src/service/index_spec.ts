import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('service', () => {
  const runner = new SchematicTestRunner('schematics', collectionPath);
  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await runner.runExternalSchematicAsync('@schematics/angular', 'workspace', { name: 'testWorkspace', version: '12' }).toPromise();
    appTree = await runner.runExternalSchematicAsync('@schematics/angular', 'application', { name: 'testApp' }, appTree).toPromise();
  });

  it('creates a service with class and spec file', async () => {
    const tree = await runner.runSchematicAsync('service', {
      name: 'test',
      http: false,
      project: 'testApp',
    }, appTree).toPromise();

    expect(tree.files.includes('/test-app/src/app/test.service.ts')).toBeTruthy();
    expect(tree.files.includes('/test-app/src/app/test.service.ts')).toBeTruthy();
    validateServiceContent(tree, false);
  });

  it('creates a service with httpClient provider', async () => {
    const tree = await runner.runSchematicAsync('service', {
      name: 'test',
      http: true,
      project: 'testApp',
    }, appTree).toPromise();

    validateServiceContent(tree, true);
  });

  const validateServiceContent = (tree: UnitTestTree, withProvidedHttp: boolean) => {
    const testService = tree.readContent('/test-app/src/app/test.service.ts');
    expect(testService.includes('httpClient: HttpClient')).toBe(withProvidedHttp);
  }
});
