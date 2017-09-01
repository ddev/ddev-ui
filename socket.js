const app = require('express')();
const http = require('http').Server(app);
const os = require('os');
const io = require('socket.io')(http);
const child = require('child_process');
const electron = require('electron');
const electronApp = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path')
const url = require('url')

io.on('connection', function(socket){

    //TODO: wrap these stdout/err pipes into a ddev class
    const ddev = function(cmd, path = '/') {
        var isArray = (cmd instanceof Array);
        if(!isArray){
            cmd = cmd ? [cmd] : [];
        }
        path = path.replace('~', os.homedir());
        return child.spawn( 'ddev', cmd, {
            cwd: path
        });
    };
    socket.on('start', function(siteDir){
        console.log('attempting to start ' + siteDir);
        const ddevStart = ddev('start', siteDir);

        socket.on('start command', function(cmd){
            if(cmd){
                ddevStart.stdin.write(cmd);
                ddevStart.stdin.end();
            }
        });

        ddevStart.stdout.on('data', function(data) {
            socket.emit('terminal output', data.toString());
        });

        ddevStart.stderr.on('data', function(data) {
            socket.emit('terminal output', data.toString());
        });

        ddevStart.on('exit', function(code){
            socket.emit('start finished', code);
        });
    });
    socket.on('stop', function(siteId){
        const ddevStop = ddev('stop', siteId);

        ddevStop.stdout.on('data', function(data) {
            socket.emit('terminal output', data.toString());
        });

        ddevStop.stderr.on('data', function(data) {
            socket.emit('terminal output', data.toString());
        });

        ddevStop.on('exit', function(code){
            socket.emit('stop finished', code);
        });
    });
    socket.on('list', function(){
        const ddevList = ddev('list');

        ddevList.stdout.on('data', function(data) {
            socket.emit('terminal output', data.toString());
            var parseListLines = function(line) {
                var newline = line.replace(/\s\s+/g, '!~!').replace(/\n/g, '!~!');
                if (line.indexOf('DDEV ROUTER STATUS') !== -1) {
                    socket.emit('routerStatus', (line.indexOf('running') !== -1));
                } else if (line.indexOf('sites found') !== -1) {
                    socket.emit('sitesCount', line.split(' ')[0]);
                } else if (newline.indexOf('NAME!~!TYPE') !== -1) {
                    var sitesArray = newline.split('!~!');
                    var output = [];
                    var arrays = [], size = 5;

                    while (sitesArray.length > 0)
                        arrays.push(sitesArray.splice(0, size));

                    for (var i = 0; i < arrays.length; i++) {
                        var currentArray = arrays[i];
                        if ((currentArray.length === 5) && (currentArray[0].indexOf('NAME') === -1)) {
                            output.push(currentArray);
                        }
                    }
                    socket.emit('siteList', output);
                }
            };
            parseListLines(data.toString());
        });

        ddevList.stderr.on('data', function(data) {
            socket.emit('terminal output', data.toString());
        });

        ddevList.on('exit', function(code){
            socket.emit('list finished', code);
        });
    });
    socket.on('restart', function(siteDir){
        const ddevRestart = ddev('restart', siteDir);

        ddevRestart.stdout.on('data', function(data) {
            socket.emit('terminal output', data.toString());
        });

        ddevRestart.stderr.on('data', function(data) {
            socket.emit('terminal output', data.toString());
        });

        ddevRestart.on('exit', function(code){
            socket.emit('restart finished', code);
        });
    });
    socket.on('add', function(sourceDir){
        const ddevConfig = ddev('config', sourceDir);

        socket.on('add command', function(cmd){
            if(cmd){
                ddevConfig.stdin.write(cmd);
                ddevConfig.stdin.end();
            }
        });

        ddevConfig.stdout.on('data', function(data){
            socket.emit('terminal output', data.toString());
        } );

        ddevConfig.stderr.on('data', function (data) {
            socket.emit('terminal output', data.toString());
        });
    });
    socket.on('exec', function(cmd){
        const command = cmd[0];
        const path = cmd[1];
        const ddevExec = ddev(['exec', command], path);

        ddevExec.stdout.on('data', function(data) {
            socket.emit('exec output', data.toString());
            socket.emit('terminal output', data.toString());
        });

        ddevExec.stderr.on('data', function(data) {
            socket.emit('exec output', data.toString());
            socket.emit('terminal output', data.toString());
        });

        ddevExec.on('exit', function(code){
            socket.emit('exec finished', code);
        });
    });
});

if(electronApp){
    // Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
    let mainWindow;

    function createWindow () {
        mainWindow = new BrowserWindow({width: 800, height: 600});

        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, '/public/socket.html'),
            protocol: 'file:',
            slashes: true
        }));

        //mainWindow.webContents.openDevTools();

        mainWindow.on('closed', function () {
            mainWindow = null
        })
    }

    electronApp.on('ready', createWindow);

    electronApp.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            electronApp.quit()
        }
    });

    electronApp.on('activate', function () {
        if (mainWindow === null) {
            createWindow()
        }
    });
} else {
    app.get('/', function(request, response){
        response.sendFile(__dirname + '/public/socket.html');
    });
}

http.listen(8099, function(){
    console.log('listening on *:8099');
});