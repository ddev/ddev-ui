//TODO: Implement Redux to store application state
var state = {};
var ddevShell = require('./js/ddev-shell');
var electron = require('electron');
var os = require('os');

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
    var markup = `<div class="col-lg-3 col-md-4 col-sm-4 card `+site.state+`" data-path="`+localPath+`" data-sitename="`+site.name+`">
        <h2>`+site.name+`</h2>
        <div>`+site.state+`</div>
        <p><a class="btn btn-secondary" href="#" onclick='electron.shell.openExternal("`+site.url+`")'><i class="fa fa-chrome" aria-hidden="true"></i></a><a class="btn btn-secondary" href='#' onclick='electron.shell.showItemInFolder("`+localPath+`")'><i class="fa fa-folder-open-o" aria-hidden="true"></i></a><a class="btn btn-secondary infobtn" href='#'><i class="fa fa-info" aria-hidden="true"></i></a></p>
        <p><a class="btn btn-primary startbtn" href="#" role="button"><i class="fa fa-play" aria-hidden="true"></i></a><a class="btn btn-primary stopbtn" href="#" role="button"><i class="fa fa-stop" aria-hidden="true"></i></a><a class="btn btn-primary restartbtn" href="#" role="button"><i class="fa fa-refresh" aria-hidden="true"></i></a><a class="btn btn-primary removebtn" href="#" role="button"><i class="fa fa-trash" aria-hidden="true"></i></a></p>
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

function updateModal(title, body){
    $('.modal-title').text(title);
    $('.modal-body').html(body);
    $('#ddevModal').modal();
}

function bindButtons(){
    $(document).on('click', '.infobtn', function() {
        console.log('describe');
        var siteName = $(this).closest('.card').data('sitename');
        getDescribe(siteName).then(function(data){
            updateModal('Additional Info For ' + siteName, createDetails(data));
        });
    });
    $(document).on('click', '.startbtn', function(){
        console.log('starting');
        ddevShell.start($(this).closest('.card').data('path'), function(data){console.log(data)});
    });
    $(document).on('click', '.stopbtn', function(){
        console.log('stopping');
        ddevShell.stop($(this).closest('.card').data('path'), function(data){console.log(data)});
    });
    $(document).on('click', '.restartbtn', function(){
        console.log('restarting');
        ddevShell.restart($(this).closest('.card').data('path'), function(data){console.log(data)});
    });
    $(document).on('click', '.removebtn', function(){
        console.log('removing');
        ddevShell.remove($(this).closest('.card').data('path'), function(data){console.log(data)});
    });
}