var vscode = require('vscode');
var net = require('net');

var app = require('./app');
var editor = require('./editor');

// this method is called when your extension is activated
function activate(context) {

    console.log('Congratulations! "code-cg" is now active! Enjoy coding cg apps!');

    // maya: python - mel
    // TODO //
    // strip comments
    // execute in seperate name space
    var execInMaya = vscode.commands.registerCommand('extension.execInMaya', function () {

        var maya = new app('maya');
        var mayaEditor = new editor('maya');
        var languageId = mayaEditor.languageId;

        if (mayaEditor.selText) {
            var command = mayaEditor.selText;
        } else if (mayaEditor.docText) {
            var command = mayaEditor.docText;
        }

        if (command) {
            maya.send(command, languageId, function (err, data) {
                if (!err) {
                    vscode.window.showInformationMessage('Executed in Maya!');
                } else {
                    console.log(err)
                    vscode.window.showWarningMessage(err);
                    vscode.window.showWarningMessage('Failed to execute in Maya!');
                }
            });
        }
    });

    context.subscriptions.push(execInMaya);

    // mari: python
    var sendToMari = vscode.commands.registerCommand('extension.sendToMari', function () {

        var mari = new app('mari');
        var mariEditor = new editor('mari');
        var languageId = mariEditor.languageId;

        if (mariEditor.selText) {
            var command = mariEditor.selText;
        } else if (mariEditor.docText) {
            var command = mariEditor.docText;
        }

        if (command) {
            command += " \x04"
            mari.send(command, languageId, function (err, success) {
                if (!err) {
                    vscode.window.showInformationMessage('Executed in Mari!');
                } else {
                    vscode.window.showWarningMessage('Failed to execute in Mari!');
                }
            });
        }
    });
    context.subscriptions.push(sendToMari);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;

