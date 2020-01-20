const vscode = require('vscode');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations, your extension "sort-strings-to-json" is now active!');

	let disposable = vscode.commands.registerCommand('extension.sortString', function () {

		vscode.window.showInformationMessage('Sort Strings.ko.json');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
