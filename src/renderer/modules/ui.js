const updater = require("./distro-updater");
const siteCreator = require("./cms-installer");
const siteCard = require("./site-cards");
const describeSite = require("./describe-site");
const removeProject = require("./remove-project");

/**
 * bootstraps application by initializing modules, downloading distros, starting ddev list polling
 */
function init() {
  siteCard.init();
  siteCreator.init();
  describeSite.init();
  removeProject.init();
  updater.updateDistros();
}

module.exports.init = init;
