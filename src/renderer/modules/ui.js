const updater = require('./distro-updater');
const siteCreator = require('./cms-installer');
const removeProject = require('./remove-project');

/**
 * bootstraps application by initializing modules, downloading distros, starting ddev list polling
 */
function init() {
  siteCreator.init();
  removeProject.init();
  updater.updateDistros();
}

module.exports.init = init;
