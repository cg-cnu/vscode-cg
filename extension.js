var vscode = require('vscode');
var net = require('net');

function activate(context) {

    console.log('Congratulations, your extension "code-cg" is now active!');

    var sendCommand = function ( port, command, callback) {

        var host = vscode.workspace.getConfiguration('cg')['host'];

        client = net.connect({ port: port, host: host }, function () {
            console.log('CONNECTED TO: ' + host + ':' + port);
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

    // Given the languageId returns the selected or whole code
    var getData = function (languageId) {

        console.log("entered get Text")

        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarnMessage('No active file!');
            return;
        }

        var doc = editor.document;
        // console.log( "doc.filePath" );
        // console.log( editor.filePath );
        // console.log( "doc.filePath" );
        // console.log( doc.languageId );
        // Only if its a valid file; which means its also saved;
        if (doc.languageId !== languageId) {
            // vscode.window.showWarningMessage('Not a valid file!');
            console.log("invalid language");
            return "invalid language";
        }

        // warn if the file is dirty
        if (doc.isDirty) {
            console.log("very dirty file")
            vscode.window.showWarningMessage('Save the file!');
            return;
        }

        var selText = doc.getText(editor.selection);
        console.log("selText: " + selText);
        var docText = doc.getText();
        console.log("docText: " + docText);

        var data = {
            "selText": doc.getText(editor.selection),
            "docText": doc.getText()
            // "filePath": doc.filePath
        }

        //  if anything selected;
        // TODO: simplify this one
        // if (selText.length !== 0) {
        //     return  {"selCode": selText,
        //             "filePath": null}
        //     // if nothing selected
        // } else {
        //     // else get all the text in the document
        //     var docText = doc.getText();
        //     // if the file is empty
        //     // TODO: better comparision find out what exactly does docText is
        //     if (docText === "") {
        //         // vscode.window.showWarningMessage('No text in the file!');
        //         return null;
        //     } else {
        //         // var text = docText
        //         return {"fullCode": docText,
        //                 "filePath" : filePath }
        //         // return text;
        //     }
        // }
        return data;
    }

    // maya: python - mel
    var sendToMaya = vscode.commands.registerCommand('extension.sendToMaya', function () {

        var software = 'maya';
        var languages = vscode.workspace.getConfiguration('maya')['languages'];
        // console.log(languages);

        for (var languageId in languages) {
            var data = getData(languageId)
            console.log("data: " + data);
            var port = languages[languageId];
            console.log("port: " + port)
            if (data === "invalid language"){
                console.log("No valid language found!");
                return;
            }else if (data.selText.length === 0 ) {
                var command = data.selText;
            }else{
                var command = data.docText;
                console.log("found command");
                console.log(command);
            }

        sendCommand( port, command, function (err, data) {
            console.log("error: " + err);
            console.log("data: " + data);
            if (!err) {
                vscode.window.showInformationMessage('Executed in Maya!');
            } else {
                vscode.window.showWarningMessage('Failed to execute in Maya!');
            }
        }
 )
            // if (code !== "invalid language") {
            //     var port = languages[languageId];
            //     sendCommand(software, code, port, function (err, success) {
            //         console.log(err);
            //         console.log(success);
            //         if (!err) {
            //             vscode.window.showInformationMessage('Executed in Maya!');
            //         } else {
            //             vscode.window.showWarningMessage('Failed to execute in Maya!');
            //         }
            //     });
            // }
        }
    });

    context.subscriptions.push(sendToMaya);

    // mari: python
    var sendToMari = vscode.commands.registerCommand('extension.sendToMari', function () {
        // The code you place here will be executed every time your command is executed
        // read the values from a different config file
        // if the config file is not present make this as the default
        var HOST = vscode.workspace.getConfiguration('cg')['host'];
        // var PORT = vscode.workspace.getConfiguration('mari')['port'];
        var COMMAND = getPyCode()
        if (COMMAND) {
            COMMAND += " \x04"
            sendCommand(HOST, PORT, COMMAND, function (err, success) {
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

