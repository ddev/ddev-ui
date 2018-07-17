const ddevShell = require("./ddev-shell");
const electron = require("electron");
// require('../../scss/components/card.scss');

function renderIcon(status) {
  // set default color
  let color = "#00A079";

  // determine server color based on status
  switch (status) {
    case "running":
      color = "#00A079";
      break;
    case "stopped":
      color = "#EF5941";
      break;
    default:
      color = "#F3DD3E";
      break;
  }

  const markup = `
  <svg width="17" height="15" xmlns="http://www.w3.org/2000/svg" class="">
    <path
      d="M15.792 4.294H1.208A1.042 1.042 0 0 1 .167 3.253V1.169C.167.594.633.128 1.208.128h14.584c.575 0 1.041.466 1.041 1.041v2.084c0 .575-.466 1.041-1.041 1.041zM14.229 1.43a.781.781 0 1 0 0 1.562.781.781 0 0 0 0-1.562zm-2.083 0a.781.781 0 1 0 0 1.562.781.781 0 0 0 0-1.562zm3.646 8.073H1.208A1.042 1.042 0 0 1 .167 8.46V6.378c0-.576.466-1.042 1.041-1.042h14.584c.575 0 1.041.466 1.041 1.042V8.46c0 .575-.466 1.042-1.041 1.042zm-1.563-2.865a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563zm-2.083 0a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563zm3.646 8.073H1.208a1.042 1.042 0 0 1-1.041-1.042v-2.083c0-.575.466-1.042 1.041-1.042h14.584c.575 0 1.041.467 1.041 1.042v2.083c0 .576-.466 1.042-1.041 1.042zm-1.563-2.865a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563zm-2.083 0a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563z"
      fillRule="nonzero"
      fill=${color}
    />
  </svg>
  `;

  return markup;
}

/**
 * TEMPLATE - generates markup for the placeholder "add/create site" card
 * @returns {string} - markup for add/create site card
 */
function createAddProject() {
  const markup = `
        <div class="add">
          <a href="#">
              <div class="add-site-icon" >
                  <i class="fa fa-plus-circle" />
              </div>
          </a>
        </div>
        `;

  return markup;
}

/**
 * TEMPLATE - generates markup for a single site
 * @param site {object} - ddev site object parsed from `ddev list` raw output array
 * @returns {string} - markup for single ddev site card
 */
function createProject(site) {
  const icon = renderIcon(site.status);
  const markup = `<ListViewRow
    height="40"
    padding="5px 10px"
    verticalAlignment="center"
    class="ListViewRow"
  >
    <Text class="column w-100 pl-3 my-2" data-sitename="${site.name}">
      <a class="infobtn align-items-center d-flex flex-row w-100" href='#'>
        ${icon}
        <span class="pl-3">
          <h3>${site.name}</h3>
          <p>${site.status}</p>
        </span>
      </a>
    </Text>
  </ListViewRow>`;

  return markup;
}

/**
 * Initialization - hook UI and generate markup.
 */
function init() {
  $(document).on("click", ".startbtn", function() {
    console.log("starting");
    ddevShell.start(
      $(this)
        .closest(".column")
        .data("path"),
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  });
  $(document).on("click", ".stopbtn", function() {
    console.log("stopping");
    ddevShell.stop(
      $(this)
        .closest(".column")
        .data("path"),
      data => {},
      error => {
        console.log(error);
      }
    );
  });
  $(document).on("click", ".restartbtn", function() {
    console.log("restarting");
    ddevShell.restart(
      $(this)
        .closest(".column")
        .data("path"),
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  });
  $(document).on("click", ".showfilesbtn", function() {
    electron.shell.showItemInFolder($(this).data("appPath"));
  });
  $(document).on("click", ".open-site", function() {
    electron.shell.openExternal($(this).data("url"));
  });
}

module.exports.init = init;
module.exports.createProject = createProject;
module.exports.renderIcon = renderIcon;
module.exports.createAddProject = createAddProject;
