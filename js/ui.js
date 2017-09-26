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

function renderUI(list) {
    $('.card-container').empty();
    list.forEach(function(site){
       var card = createCard(site);
       $('.card-container').append(card);
    });
}

function createCard(site){
    var localPath = site.path.replace('~', os.homedir());
    var markup = `<div class="col-lg-3 col-md-4 col-sm-4 card `+site.state+`" data-path="`+localPath+`">
        <h2>`+site.name+`</h2>
        <div>`+site.state+`</div>
        <p><a class="btn btn-secondary" href="#" onclick='electron.shell.openExternal("`+site.url+`")'><i class="fa fa-chrome" aria-hidden="true"></i></a><a class="btn btn-secondary" href='#' onclick='electron.shell.showItemInFolder("`+localPath+`")'><i class="fa fa-folder-open-o" aria-hidden="true"></i></a></p>
        <p><a class="btn btn-primary startbtn" href="#" role="button"><i class="fa fa-play" aria-hidden="true"></i></a><a class="btn btn-primary stopbtn" href="#" role="button"><i class="fa fa-stop" aria-hidden="true"></i></a><a class="btn btn-primary restartbtn" href="#" role="button"><i class="fa fa-refresh" aria-hidden="true"></i></a><a class="btn btn-primary removebtn" href="#" role="button"><i class="fa fa-trash" aria-hidden="true"></i></a></p>
    </div>`;

    return markup;
}

function bindButtons(){
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