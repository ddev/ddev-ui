var ddevShell = require('./ddev-shell');

/**
 * TEMPLATE - generates markup for the placeholder "add/create site" card
 * @returns {string} - markup for add/create site card
 */
function createAddCard(){
    var markup = `<div class="column col-lg-3 col-md-4 col-sm-4">
        <div class="card add">
            <div class="card-header">
                <h2><a href="#">Add/Create Site</a></h2>
            </div>
            <div class="card-body">
                <a href="#">
                    <div class="add-site-icon" >
                        <i class="fa fa-plus-circle" />
                    </div>
                </a>
            </div>
            <div class="card-footer">
            </div>
        </div>
    </div>`;

    return markup;
}

/**
 * TEMPLATE - generates markup for a single site
 * @param site {object} - ddev site object parsed from `ddev list` raw output array
 * @returns {string} - markup for single ddev site card
 */
function createCard(site) {
    var markup = `<div class="column col-lg-3 col-md-4 col-sm-4 ` + site.status + `" data-path="` + site.approot + `" data-sitename="` + site.name + `">
        <div class="card">
            <div class="card-header">
                <h2><a href="#" onclick='electron.shell.openExternal("` + site.httpurl + `")'>` + site.name + `</a></h2>
            </div>
            <div class="card-body">
                <a href="#" onclick='electron.shell.openExternal("` + site.httpurl + `")'>
                    <div class="site-icon-container">
                        <img class="site-icon" src="img/` + site.type + `.png" /> 
                    </div>
                    <div class="card-status">
                        <div>` + site.status + `</div>
                    </div>
                </a>
            </div>
            <div class="card-footer">
                <a class="btn btn-primary startbtn" href="#" role="button"><i class="fa fa-play" aria-hidden="true"></i></a>
                <a class="btn btn-primary stopbtn" href="#" role="button"><i class="fa fa-stop" aria-hidden="true"></i></a>
                <a class="btn btn-primary infobtn" href='#'><i class="fa fa-info" aria-hidden="true"></i></a>
              <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item restartbtn" href="#">Restart</a>
                <a class="dropdown-item removebtn" href="#" data-project-name="`+site.name+`" data-project-path="` + site.approot + `">Remove Project</a>
                <a class="dropdown-item" onclick='electron.shell.showItemInFolder("` + site.approot + `")' href="#">Browse Local Files</a>
              </div>
            </div>
        </div>
    </div>`;

    return markup;
}

/**
 * Initialization - hook UI and generate markup.
 */
function init(){
    $(document).on('click', '.startbtn', function () {
        console.log('starting');
        ddevShell.start($(this).closest('.column').data('path'), function (data) {
            console.log(data)
        }, function (error) {
            console.log(error)
        });
    });
    $(document).on('click', '.stopbtn', function () {
        console.log('stopping');
        ddevShell.stop($(this).closest('.column').data('path'), function (data) {
        }, function (error) {
            console.log(error)
        });
    });
    $(document).on('click', '.restartbtn', function () {
        console.log('restarting');
        ddevShell.restart($(this).closest('.column').data('path'), function (data) {
            console.log(data)
        }, function (error) {
            console.log(error)
        });
    });
}

module.exports.init = init;
module.exports.createCard = createCard;
module.exports.createAddCard = createAddCard;
