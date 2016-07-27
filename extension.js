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
            console.log(mayaEditor.selText);
            var command = mayaEditor.selText;
        } else if (mayaEditor.docText) {
            console.log(mayaEditor.docText);
            var command = mayaEditor.docText;
        }

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

        var mari = new app('mari');
        var mariEditor = new editor('mari');
        var languageId = mariEditor.languageId;

        if (mariEditor.selText) {
            console.log(mariEditor.selText);
            var command = mariEditor.selText;
        } else if (mariEditor.docText) {
            console.log(mariEditor.docText);
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

    // Nuke: python
    var sendToNuke = vscode.commands.registerCommand('extension.sendToNuke', function () {

        var nuke = new app('nuke');
        var nukeEditor = new editor('nuke');
        var languageId = nukeEditor.languageId;

        // TODO: replace this with command = ( nukeEditor.selText || nukeEditor.docText || null )
        if (nukeEditor.selText) {
            console.log(nukeEditor.selText);
            var command = nukeEditor.selText;
        } else if (nukeEditor.docText) {
            console.log(nukeEditor.docText);
            var command = nukeEditor.docText;
        }

        if (command) {
            var PY_CMD_TEMPLATE =
                    "\
                    import traceback\
                    import sys\
                    import __main__\
                    namespace = __main__.__dict__.get('_atom_plugin_SendToNuke')\
                    if not namespace:\
                        namespace = __main__.__dict__.copy()\
                        __main__.__dict__['_atom_plugin_SendToNuke'] = namespace\
                    namespace['__file__'] = r\'/home/salapati/codemonk/code-cg/test/test.py\'\
                    try:\
                        execfile(r\'/home/salapati/codemonk/code-cg/test/test.py\', namespace, namespace)\
                    except:\
                        sys.stdout.write(traceback.format_exc())\
                        traceback.print_exc()\
                    "

            command = PY_CMD_TEMPLATE
            console.log(command)
            nuke.send(command, languageId, function (err, success) {
                if (!err) {
                    vscode.window.showInformationMessage('Executed in Nuke!');
                } else {
                    vscode.window.showWarningMessage('Failed to execute in Nuke!');
                }
            });
        }
    });
    context.subscriptions.push(sendToNuke);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;

