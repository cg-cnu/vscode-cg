// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var net = require('net');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-maya" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.sayHello', function () {
        // The code you place here will be executed every time your command is executed

        // read the values from a different config file
        // if the config file is not present make this as the default
        var HOST = '127.0.0.1';
        var PORT = 7002;

        // // Get the current text editor
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarnMessage('No active file!');
            return;
        }

        // then get the document
        var doc = editor.document;

        // Only if its a valid python file; which means its also saved;
        if (doc.languageId !== "python") {
            vscode.window.showWarningMessage('Save the file!');
            return;
        }

        // warn if the file is diry
        if (doc.isDirty) {
            vscode.window.showWarningMessage('Save the file!');
            return;
        }

        var selText = doc.getText(editor.selection);
        //  if anything selected;
        if (selText.length !== 0) {
            var text = selText;
        // if nothing selected
        } else {
            // else get all the text in the document
            var docText = doc.getText();
            // if the file is empty
            if (docText === "") {
                vscode.window.showWarningMessage('No text in the file!');
                return;
            }else{
                var text = docText
            }
        }

        // write to maya
        var client = new net.Socket();
        client.connect(PORT, HOST, function () {

            console.log('CONNECTED TO: ' + HOST + ':' + PORT);
            // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
            client.write('\n' + text + '\n');
        });

        // Add a 'data' event handler for the client socket
        // data is what the server sent to this socket
        client.on('data', function (data) {
            console.log('DATA: ' + data);
            // Close the client socket completely
            client.destroy();
        });

        // Add a 'close' event handler for the client socket
        client.on('close', function () {
            console.log('Connection closed');
        });

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
        //

    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;

