console.log('new user connected');

var python = child.spawn( 'python', ['compute.py'],[]);

var chunk = '';
python.stdout.on('data', function(data){
    chunk += data
    socket.emit('newdata', chunk);
} );

python.stderr.on('data', function (data) {
    console.log('Failed to start child process.');
});

const exec = function (cmd, path) {
    path = '~';
    child.spawn('ddev', [cmd], {
        cwd:
    });
};

module.exports = {
    exec: exec,
    otherMethod: function() {}
};