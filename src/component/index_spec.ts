import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('component', () => {
  const runner = new SchematicTestRunner('schematics', collectionPath);
  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await runner.runExternalSchematicAsync('@schematics/angular', 'workspace', { name: 'testWorkspace', version: '10' }).toPromise();
    appTree = await runner.runExternalSchematicAsync('@schematics/angular', 'application', { name: 'testApp' }, appTree).toPromise();
  });

  it('creates a component with the relevant files', async () => {
    const tree = await runner.runSchematicAsync('component', {
      name: 'test',
      project: 'testApp',
    }, appTree).toPromise();

    expect(tree.files.includes('/test-app/src/app/test/test.component.ts')).toBeTruthy();
    expect(tree.files.includes('/test-app/src/app/test/test.component.html')).toBeTruthy();
    expect(tree.files.includes('/test-app/src/app/test/test.component.spec.ts')).toBeTruthy();
    expect(tree.files.includes('/test-app/src/app/test/test.component.css')).toBeTruthy();
  });

  it('creates a form component', async () => {
    const tree = await runner.runSchematicAsync('component', {
      name: 'test',
      form: 'login',
      project: 'testApp',
    }, appTree).toPromise();

    const testComponentClass = tree.readContent('/test-app/src/app/test/test.component.ts');
    expect(testComponentClass.includes('loginForm: FormGroup')).toBeTruthy();
    expect(testComponentClass.includes('private fb: FormBuilder')).toBeTruthy();

    const testComponentTemplate = tree.readContent('/test-app/src/app/test/test.component.html');
    expect(testComponentTemplate.includes('<form [formGroup]="loginForm">')).toBeTruthy();

    const testComponentSpec = tree.readContent('/test-app/src/app/test/test.component.spec.ts');
    expect(testComponentSpec.includes('ReactiveFormsModule')).toBeTruthy();
  });
});
