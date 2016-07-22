var vscode = require('vscode');
var net = require('net');

function activate(context) {

    console.log('Congratulations, your extension "code-cg" is now active!');

    var sendCmd = function (HOST, PORT, COMMAND, callback) {

        client = net.connect({ port: PORT, host: HOST }, function () {
            console.log('CONNECTED TO: ' + HOST + ':' + PORT);
            client.write('\n ' + COMMAND + ' \n');
        });

        // on success
        client.on('data', function (data) {
            console.log('DATA: ' + data);
            // Close the client socket completely: end / destroy ?
            client.destroy();
            callback(null, data);
        });

        // on error
        client.on('error', function (err) {
            callback(err, null)
        })
    }


    var getCode = function (languageId) {

        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarnMessage('No active file!');
            return;
        }

        var doc = editor.document;

        // Only if its a valid file; which means its also saved;
        if (doc.languageId !== languageId) {
            vscode.window.showWarningMessage('Not a valid file!');
            return;
        }

        // warn if the file is diry
        if (doc.isDirty) {
            vscode.window.showWarningMessage('Save the file!');
            return;
        }

        var selText = doc.getText(editor.selection);

        //  if anything selected;
        // TODO: simplify this one
        if (selText.length !== 0) {
            var text = selText;
            // if nothing selected
        } else {
            // else get all the text in the document
            var docText = doc.getText();
            // if the file is empty
            // TODO: better comparision find out what exactly does docText is
            if (docText === "") {
                vscode.window.showWarningMessage('No text in the file!');
                return null;
            } else {
                var text = docText
                return text;
            }
        };
    }

    // maya: python - mel
    var sendToMaya = vscode.commands.registerCommand('extension.sendToMaya', function () {
        // The code you place here will be executed every time your command is executed

        // read the values from the config file
        var HOST = vscode.workspace.getConfiguration('cg')['host'];
        var PORT = vscode.workspace.getConfiguration('maya')['python-port'];
        // get the python code from the current file
        // either selected or all

        var COMMAND, PORT = getCode('python');

        // try for mel ?

        if (COMMAND) {
            sendCmd(HOST, PORT, COMMAND, function (err, success) {
                console.log(err);
                console.log(success);
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
        // The code you place here will be executed every time your command is executed

        // read the values from a different config file
        // if the config file is not present make this as the default
        var HOST = vscode.workspace.getConfiguration('cg')['host'];
        var PORT = vscode.workspace.getConfiguration('mari')['port'];
        var COMMAND = getPyCode()

        if (COMMAND) {
            COMMAND += " \x04"
            sendCmd(HOST, PORT, COMMAND, function (err, success) {
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

