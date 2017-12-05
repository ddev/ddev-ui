//TODO: Implement Redux to store application state
var state = {};
var ddevShell = require('./js/ddev-shell');
var electron = require('electron');
var os = require('os');
var dialog = require('electron').remote.dialog;
var tarball = require('tarball-extract');
var updater = require('./js/distro-updater');


function init() {
    updater.updateDistros()
        .then(function (response) {
            console.log('done updating distros', response);
        })
        .catch(function (error) {
            console.log('fail', error);
        });
    setInterval(fetchState, 1000);
}

function fetchState() {
    ddevShell.list().then(function (data) {
        if (JSON.stringify(data).trim() !== JSON.stringify(state).trim()) {
            state = data;
            renderUI(state);
        }
    });
}

function getDescribe(siteName, errorCallback) {
    var promise = new Promise(function (resolve, reject) {
        ddevShell.describe(siteName, errorCallback).then(function (data) {
            resolve(data);
        })
    });
    return promise;
}

function renderUI(list) {
    $('.card-container').empty();
    list.forEach(function (site) {
        var card = createCard(site);
        $('.card-container').append(card);
    });
}

function createCard(site) {
    var markup = `<div class="column col-lg-3 col-md-4 col-sm-4 ` + site.status + `" data-path="` + site.approot + `" data-sitename="` + site.name + `">
        <div class="card">
            <div class="card-header">
                <h2><a href="#" onclick='electron.shell.openExternal("` + site.httpurl + `")'>` + site.name + `</a></h2>
            </div>
            <div class="card-body">
                <a href="#" onclick='electron.shell.openExternal("` + site.httpurl + `")'>
                    <div>
                        <img style="width: 50%" src="img/` + site.type + `.png" /> 
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
              <button class="btn btn-primary dropdown-toggle" style="cursor: pointer;" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item restartbtn" href="#">Restart</a>
                <a class="dropdown-item" onclick='electron.shell.showItemInFolder("\` + site.approot + \`")' href="#">Browse Local Files</a>
              </div>
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

function unpackDistro(distro, path) {
    tarball.extractTarball(distro, path, function (err) {
        if (err) {
            return err
        } else {
            return "finished"
        }
    });
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

function displayPrompt() {
    var dialog = bootbox.dialog({
        title: 'A custom dialog with buttons and callbacks',
        message: "<p>Remove Local Development Environment</p>",
        buttons: {
            remove: {
                label: "Remove the site and leave the database",
                className: 'btn-info',
                callback: function () {
                    alert('remove');
                }
            },
            all: {
                label: "Delete the local site AND the database.",
                className: 'btn-warning',
                callback: function () {
                    alert('remove db');
                    return false;
                }
            }
        }
    });
}

function bindButtons() {
    $(document).on('click', '.infobtn', function () {
        console.log('describe');
        var siteName = $(this).closest('.column').data('sitename');
        getDescribe(siteName).then(function (data) {
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
    $(document).on('click', '.removebtn', function () {
        displayPrompt();
        console.log('removing');
        //ddevShell.remove($(this).closest('.column').data('path'), function(data){console.log(data)});
    });
    $(document).on('click', '.add', function () {
        resetAddModal();
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
        var distros = {
            drupal7: 'distros/drupal7/drupal-7.56.tar.gz',
            drupal8: 'distros/drupal8/drupal-8.3.6.tar.gz',
            wordpress: 'distros/wordpress/wordpress-4.8.2.tar.gz'
        };
        var type = $('#appType').val();
        var path = $('.selected-path-text').val();
        var name = $('#site-name').val();
        var unpackedDirectory = (path + "/" + distros[type].split('/')[2]).replace('.tar.gz', '');
        if (type === 'wordpress') {
            unpackedDirectory = (path + "/" + type);
        }
        unpackDistro(distros[type], path);
        ddevShell.config(unpackedDirectory, name, '', createFinished);

        function createFinished(success) {
            if (success) {
                resetAddModal();
                $('#distroModal').modal('hide');
            }
        }
    });
}