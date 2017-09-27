//TODO: Implement Redux to store application state
var state = {};
var ddevShell = require('./js/ddev-shell');
var electron = require('electron');
var os = require('os');
var dialog = require('electron').remote.dialog;
var tarball = require('tarball-extract');

function init() {
    setInterval(fetchState,1000);
    bindButtons();
}

function fetchState() {
    ddevShell.list().then(function(data){
        if(JSON.stringify(data).trim() !== JSON.stringify(state).trim()){
            state = data;
            renderUI(state);
        }
    });
}

function getDescribe(siteName) {
    var promise = new Promise(function(resolve, reject) {
        ddevShell.describe(siteName).then(function(data){
            resolve(data);
        })
    });
    return promise;
}

function renderUI(list) {
    $('.card-container').empty();
    list.forEach(function(site){
       var card = createCard(site);
       $('.card-container').append(card);
    });
}

function createCard(site){
    var localPath = site.path.replace('~', os.homedir());
    var markup = `<div class="column col-lg-3 col-md-4 col-sm-4 `+site.state+`" data-path="`+localPath+`" data-sitename="`+site.name+`">
        <div class="card">
            <div class="card-header">
                <h2>`+site.name+`</h2>
            </div>
            <div class="card-body">
                <div>`+site.state+`</div>
                <div>
                    <a class="btn btn-secondary" href="#" onclick='electron.shell.openExternal("`+site.url+`")'><i class="fa fa-chrome" aria-hidden="true"></i></a>
                    <a class="btn btn-secondary" href='#' onclick='electron.shell.showItemInFolder("`+localPath+`")'><i class="fa fa-folder-open-o" aria-hidden="true"></i></a>
                    <a class="btn btn-secondary infobtn" href='#'><i class="fa fa-info" aria-hidden="true"></i></a>
                </div>
            </div>
            <div class="card-footer">
                <a class="btn btn-primary startbtn" href="#" role="button"><i class="fa fa-play" aria-hidden="true"></i></a>
                <a class="btn btn-primary stopbtn" href="#" role="button"><i class="fa fa-stop" aria-hidden="true"></i></a>
                <a class="btn btn-primary restartbtn" href="#" role="button"><i class="fa fa-refresh" aria-hidden="true"></i></a>
                <a class="btn btn-primary removebtn" href="#" role="button"><i class="fa fa-trash" aria-hidden="true"></i></a>
            </div>
        </div>
    </div>`;

    return markup;
}

function createDetails(details){
    var output = '';
    for (var key in details) {
        if (details.hasOwnProperty(key)) {
            var section = details[key];
            output += '<div><h3>'+key+'</h3><table>';
            for (var k in section){
                if(section.hasOwnProperty(k) && k !== 'notes'){
                    output += '<tr><td>' + k + '</td>' + '<td>' + section[k] + '</td></tr>';
                }
            }
            output += '</table>';
            if(section.notes){
                output += '<ul>';
                section.notes.forEach(function(note){
                   output += '<li>' + note + '</li>';
                });
                output += '</ul>';
            }
            output += '</div>';
        }
    }
    return output;
}

function unpackDistro(distro, path){
    tarball.extractTarball(distro, path, function(err){
        if(err) {
            return err
        } else {
            return "finished"
        }
    });
}

function resetAddModal() {
    $('#site-name').val('');
    $('.selected-path-text').val('');
    $('.modal-footer .btn').removeClass('btn-primary').addClass('btn-secondary');
}

function updateModal(title, body){
    $('#modalLabel').text(title);
    $('#modalBody').html(body);
    $('#ddevModal').modal();
}

function bindButtons(){
    $(document).on('click', '.infobtn', function() {
        console.log('describe');
        var siteName = $(this).closest('.column').data('sitename');
        getDescribe(siteName).then(function(data){
            updateModal('Additional Info For ' + siteName, createDetails(data));
        });
    });
    $(document).on('click', '.startbtn', function(){
        console.log('starting');
        ddevShell.start($(this).closest('.column').data('path'), function(data){console.log(data)});
    });
    $(document).on('click', '.stopbtn', function(){
        console.log('stopping');
        ddevShell.stop($(this).closest('.column').data('path'), function(data){console.log(data)});
    });
    $(document).on('click', '.restartbtn', function(){
        console.log('restarting');
        ddevShell.restart($(this).closest('.column').data('path'), function(data){console.log(data)});
    });
    $(document).on('click', '.removebtn', function(){
        console.log('removing');
        ddevShell.remove($(this).closest('.column').data('path'), function(data){console.log(data)});
    });
    $(document).on('click', '.add', function(){
        resetAddModal();
        $('#distroModal').modal();
    });
    $(document).on('click', '.select-path-folder', function(){
        var path = dialog.showOpenDialog({
            properties: ['openDirectory']
        });
        if(path){
            $('.selected-path-text').val(path[0]);
        }
    });

    $(document).on('click', '.tile img', function(){
       $('#appType').val($(this).data('type')).trigger('change');
    });
    $(document).on('change', '#appType', function(){
        $('.tile img').removeClass('active');
        $('.'+$(this).val()).addClass('active');
    });
}