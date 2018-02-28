// TODO: Implement Redux to store application state
let state = {};
const ddevShell = require('./ddev-shell');
const updater = require('./distro-updater');
const siteCreator = require('./cms-installer');
const siteCard = require('./site-cards');
const describeSite = require('./describe-site');
const removeProject = require('./remove-project');
require('../../scss/main.scss');

/**
 * (re)renders UI cards and status messaging from a ddev list raw output
 * @param list
 */
function renderUI(list, actions) {
  const validRouterStates = [
    'starting',
    'healthy',
  ];

  $('.card-container').empty();
  $('.card-container').append(siteCard.createAddCard());
  if (list.length !== 0) {
    list.forEach((site) => {
      const card = siteCard.createCard(site);
      $('.card-container').append(card);
    });

    let showStatus = false;
    const routerStatus = list[0].router_status;

    if ((validRouterStates.indexOf(routerStatus) === -1)) {
      showStatus = true;
    }
    actions.updateStatus(routerStatus);
    actions.showStatus(showStatus);
  }
}

/**
 * to be run on a loop - polls ddev list and rerenders on update
 */
function fetchState(actions) {
  ddevShell.list().then((data) => {
    if (JSON.stringify(data).trim() !== JSON.stringify(state).trim()) {
      state = data;
      renderUI(state, actions);
    }
    fetchState();
  }).catch(() => {
    fetchState();
  });
}

/**
 * bootstraps application by initializing modules, downloading distros, starting ddev list polling
 */
function init(actions) {
  siteCard.init();
  siteCreator.init();
  describeSite.init();
  removeProject.init();
  updater.updateDistros();
  fetchState(actions);
}

module.exports.init = init;
