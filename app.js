var vscode = require('vscode');
var net = require('net');
// var test = "test";

var App = function (name, language) {
    // var self = this;
    // console.log(name);
    // console.log(language);
    this.name = name;
    this.language = language;
    this.host = vscode.workspace.getConfiguration('cg')['host'];
    this.port = vscode.workspace.getConfiguration(name)["languages"][language];

    // console.log("this.port inside app");
    // console.log(this.port);
    // console.log(this.host);

    this.send = function (command, callback) {

        // console.log("this.port inside send");
        // console.log(this.port);
        // console.log(this.host);
        client = net.connect({ port: this.port, host: this.host }, function () {
            // console.log('CONNECTED TO: ' + host + ':' + port);
            client.write('\n ' + command + ' \n');
        });

        // on success
        client.on('data', function (data) {
            // Close the client socket completely: end / destroy ?
            client.destroy();
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