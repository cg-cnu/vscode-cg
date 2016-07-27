var vscode = require('vscode');
var net = require('net');

var app = require('./app');
var editor = require('./editor');

function activate(context) {

    console.log('Congratulations! "code-cg" is now active!\
                    Enjoy coding cg apps!');

    // maya: python - mel
    var sendToMaya = vscode.commands.registerCommand('extension.sendToMaya', function () {

        var maya = new app('maya');
        var mayaEditor = new editor('maya');
        var languageId = mayaEditor.languageId;
        if (mayaEditor.selText) {
            // console.log(mayaEditor.selText);
            var command = mayaEditor.selText;
        } else if (mayaEditor.docText) {
            // console.log(mayaEditor.docText);
            var command = mayaEditor.docText;
        }
        // var command = "print 'test' ";
        // get the command
        if (command) {
            maya.send(command, languageId, function (err, data) {
                if (!err) {
                    vscode.window.showInformationMessage('Executed in Maya!');
                } else {
                    vscode.window.showWarningMessage('Failed to execute in Maya!');
                }
            });
        }
    });
    context.subscriptions.push(sendToMaya);

    // mari: python
    var sendToMari = vscode.commands.registerCommand('extension.sendToMari', function () {

        var mari = new app('mari', 'python');
        var mariEditor = new editor('mari');
        if (mariEditor.selText) {
            console.log(mariEditor.selText);
            var command = mariEditor.selText;
        } else {
            console.log(mariEditor.docText);
            var command = mariEditor.docText;
        }

        if (command) {
            command += " \x04"
            mari.send(command, function (err, success) {
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

