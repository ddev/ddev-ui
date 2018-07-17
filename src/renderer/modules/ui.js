// TODO: Implement Redux to store application state
let state = {};
const electron = require("electron");
const dialog = require("electron").remote.dialog;

const ddevShell = require("./ddev-shell");
const updater = require("./distro-updater");
const siteCreator = require("./cms-installer");
const projectList = require("./project-list");
const siteCard = require("./site-cards");
const describeSite = require("./describe-site");
const removeProject = require("./remove-project");

// require('../../scss/main.scss');
// require('./resources/scss/main.scss');

/**
 * (re)renders UI cards and status messaging from a ddev list raw output
 * @param list
 */
function renderUI(list) {
  const validRouterStates = ["starting", "healthy"];
  let routerStatusText =
    "DDEV Router Not Running - No Running DDEV Applications.";

  // UNcomment to replace sidebar list * for NOW *
  $(".ListViewSection").empty();
  if (list.length !== 0) {
    list.forEach(site => {
      const card = projectList.createProject(site);
      $(".ListViewSection").append(card);
    });
    routerStatusText =
      validRouterStates.indexOf(list[0].router_status) != -1
        ? ""
        : routerStatusText;
  }

  $(".card-container").empty();
  if (list.length !== 0) {
    list.forEach(site => {
      const card = siteCard.createCard(site);
      $(".card-container").append(card);
    });
    routerStatusText =
      validRouterStates.indexOf(list[0].router_status) != -1
        ? ""
        : routerStatusText;
  }
  $(".router-status-label").text(routerStatusText);
}

/**
 * to be run on a loop - polls ddev list and compares CLI state to current app state and rerenders on mismatch
 */
function fetchState() {
  ddevShell
    .list()
    .then(data => {
      if (JSON.stringify(data).trim() !== JSON.stringify(state).trim()) {
        state = data;
        renderUI(state);
      }
      fetchState();
    })
    .catch(() => {
      fetchState();
    });
}

/**
 * bootstraps application by initializing modules, downloading distros, starting ddev list polling
 */
function init() {
  siteCard.init();
  projectList.init();
  siteCreator.init();
  describeSite.init();
  removeProject.init();
  updater.updateDistros();
  fetchState();
}

module.exports.init = init;
