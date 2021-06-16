import { buildDefaultPath, getWorkspace } from '@schematics/angular/utility/workspace';
import { parseName } from '@schematics/angular/utility/parse-name';
import { Tree } from '@angular-devkit/schematics';
import { ProjectOptions } from './project-options.model';

export async function setProjectOptions(host: Tree, options: ProjectOptions): Promise<ProjectOptions> {
  const workspace = await getWorkspace(host);
  const project = workspace.projects.get(options.project);
  if (options.path === undefined && project) {
    options.path = buildDefaultPath(project);
  }

  const parsedPath = parseName(options.path, options.name);
  options.name = parsedPath.name;
  options.path = parsedPath.path;

  return options;
}
