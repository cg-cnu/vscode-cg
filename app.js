var vscode = require('vscode');
var net = require('net');

var App = function (name) {

    this.name = name;

    this.send = function (command, languageId, callback) {
        host = vscode.workspace.getConfiguration('cg')['host'];
        port = vscode.workspace.getConfiguration(this.name)["languages"][languageId];
        client = net.connect({ port: port, host: host }, function () {
            console.log('CONNECTED TO: ' + host + ':' + port); // host and port showing undef ?
            client.write('\n ' + command + ' \n');
        });
        // on success
        client.on('data', function (data) {
            client.destroy(); // end / destroy ?
            callback(null, data);
        });
        // on error
        client.on('error', function (err) {
            callback(err, null)
        })
    }
};

// module.exports.test = test;
module.exports = App;