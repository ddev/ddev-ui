//TODO: Implement Redux to store application state
var state = {};
var ddevShell = require('./js/ddev-shell');
var electron = require('electron');
var os = require('os');
var dialog = require('electron').remote.dialog;
var updater = require('./js/distro-updater');
var siteCreator = require('./js/cms-installer');


function init() {
    updater.updateDistros()
        .then(function (response) {
            console.log('done updating distros', response);
        })
        .catch(function (error) {
            console.log('fail', error);
        });
    setInterval(fetchState, 1000);
    bindButtons();
    siteCreator.init();
}

function fetchState() {
    ddevShell.list().then(function (data) {
        if (JSON.stringify(data).trim() !== JSON.stringify(state).trim()) {
            state = data;
            renderUI(state);
        }
    });
}

function renderUI(list) {
    var validRouterStates = [
        "starting",
        "healthy"
    ];
    var routerStatusText = "DDEV Router Not Running - No Running DDEV Applications.";
    $('.card-container').empty();
    $('.card-container').append(createAddCard());
    if(list.length !== 0){
        list.forEach(function (site) {
            var card = createCard(site);
            $('.card-container').append(card);
        });
        routerStatusText = (validRouterStates.indexOf(list[0].router_status) != -1) ? '' : routerStatusText;
    }
    $('.router-status-label').text(routerStatusText);
}

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
                <a class="dropdown-item" onclick='electron.shell.showItemInFolder("` + site.approot + `")' href="#">Browse Local Files</a>
              </div>
            </div>
        </div>
    </div>`;

    return markup;
}

function createModal(id, title, body, footer) {
    var markup = `<div class="modal fade" id="`+id+`" tabindex="-1" role="dialog" aria-labelledby="`+id+`Label" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title" id="modalLabel">`+title+`</h2>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="modalBody">
                    `+body+`
                </div>
                <footer class="modal-footer">
                    `+footer+`
                </footer>
            </div>
        </div>
    </div>`;

    return markup;
}

function createDetails(details) {
    var output = '';
    for (var key in details) {
        if (details.hasOwnProperty(key)) {
            var section = details[key];
            output += '<div><h3>' + key + '</h3><table>';
            for (var k in section) {
                if (section.hasOwnProperty(k) && k !== 'notes') {
                    output += '<tr><td>' + k + '</td>' + '<td>' + section[k] + '</td></tr>';
                }
            }
            output += '</table>';
            if (section.notes) {
                output += '<ul>';
                section.notes.forEach(function (note) {
                    output += '<li>' + note + '</li>';
                });
                output += '</ul>';
            }
            output += '</div>';
        }
    }
    return output;
}

function resetAddModal() {
    $('#appType').val('').trigger('change');
    $('#site-name').val('');
    $('.selected-path-text').val('');
}

function updateModal(title, body) {
    $('#modalLabel').text(title);
    $('#modalBody').html(body);
    $('#ddevModal').modal();
}

function bindButtons() {
    $(document).on('click', '.infobtn', function () {
        console.log('describe');
        var siteName = $(this).closest('.column').data('sitename');
        ddevShell.describe(siteName).then(function (data) {
            updateModal('Additional Info For ' + siteName, createDetails(data));
        });
    });
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
            console.log(data)
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
    $(document).on('click', '.add', function () {
        resetAddModal();
        alert('In order to add a new site, DDEV requires elevated permissions to modify your Hosts file. You may be prompted for your username and password to continue.');
        var command = 'version';
        ddevShell.sudo(command)
            .then(function(){
                $('#addOptionsDialog').modal();
            })
            .catch(function(err){
                alert(err);
            });
    });
    $(document).on('click', '.start-from-template', function () {
        siteCreator.resetAddModal();
        resetAddModal();
        $('#addOptionsDialog').modal('hide');
        $('#distroModal').modal();
    });
    $(document).on('click', '.select-path-folder', function () {
        var path = dialog.showOpenDialog({
            properties: ['openDirectory']
        });
        if (path) {
            $('.selected-path-text').val(path[0]);
        }
    });

    $(document).on('click', '.tile img', function () {
        $('#appType').val($(this).data('type')).trigger('change');
    });
    $(document).on('change', '#appType', function () {
        $('.tile img').removeClass('active');
        if ($(this).val()) {
            $('.' + $(this).val()).addClass('active');
        }
    });

    $(document).on('click', '.create-site', function () {
        var type = $('#appType').val();
        var targetCMS = [];
        var targetPath = $('.selected-path-text').val();
        var name = $('#site-name').val();
        siteCreator.addCMS(name,type,targetPath);
        return false;
    });
}