import { ProjectOptions } from '../../helpers/project-options.model';

export interface ServiceOptions extends ProjectOptions {
  http: boolean;
}
