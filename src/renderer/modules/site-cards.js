const ddevShell = require("./ddev-shell");
const electron = require("electron");

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
