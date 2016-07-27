var vscode = require("vscode");

var Editor = function (appName) {

    console.log("entered get Text")
    // if no editor found throw error and return
    var editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('No active file!');
        return;
    }

    var doc = editor.document;
    var languages = vscode.workspace.getConfiguration(appName)["languages"];

    for (var languageId in languages) {
        if (doc.languageId == languageId) {
            if (doc.isDirty) {
                // console.log("very dirty file")
                vscode.window.showWarningMessage('Save the file!');
                return
            }else{
                // var data = {}
                this.selText = doc.getText(editor.selection);
                this.docText = doc.getText();
                this.filePath = "currentFilePath";
                // return data
            }
        }else{
            console.log("not a valid language")
        }
    }
}

module.exports = Editor;