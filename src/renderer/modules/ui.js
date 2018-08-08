import { updateDistros } from './distro-updater';
import { init as _cmsInstaller } from './cms-installer';
import { init as _removeProject } from './remove-project';

/**
 * bootstraps application by initializing modules, downloading distros, starting ddev list polling
 */
function init() {
  _cmsInstaller();
  _removeProject();
  updateDistros();
}

const _init = init;
export { _init as init };
