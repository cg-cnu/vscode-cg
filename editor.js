var vscode = require("vscode");

var Editor = function (appName) {

    // if no editor found warn and return
    var codeEditor = vscode.window.activeTextEditor;
    if (!codeEditor) {
        vscode.window.showWarningMessage('No active file!');
        return;
    }

    // get the document
    var doc = codeEditor.document;
    var languages = vscode.workspace.getConfiguration(appName)["languages"];
    // console.log(languages)
    for (var languageId in languages) {
        if (doc.languageId == languageId) {
            // if the document is not saved warn and return
            if (doc.isDirty) {
                // console.log("very dirty file")
                vscode.window.showWarningMessage('Save the file!');
                return
            }else{
                this.languageId = languageId;
                this.selText = doc.getText(codeEditor.selection);
                this.docText = doc.getText();
                this.filePath = "currentFilePath";
                return
            }
        }else{
            console.log(languageId);
            console.log(languageId + ": Not a valid language!")
        }
    }
    vscode.window.showWarningMessage('No valid language found!');
}

module.exports = Editor;