import {environment} from '../../environments/environment';

export class Utility {
  static getPath(): string {
    return environment.protocol + '://' + environment.domain + ':' + environment.port + environment.apiPath;
  }
}
