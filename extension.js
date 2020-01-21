const vscode = require('vscode');
const fs     = require('fs');
// import Settings from './main/settings';

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const { window, commands, env: { clipboard }, Position } = vscode;
	const { copyFromClipboard, destPath, destFileName } = vscode.workspace.getConfiguration("sort-string-2-json", undefined);
	let editor = window.activeTextEditor;
	let editorText = editor.document.getText();
	let selectText = editor.document.getText(editor.selection);
	let destFileFullPath = `${destPath}/${destFileName}`;
	if(!editor) return;

	let disposable = vscode.commands.registerCommand('extension.sortString', function () {
		vscode.window.showInformationMessage('Strings sort Start!');
		clipboard.readText().then(v => {
			if(!copyFromClipboard) return Promise.reject();
			return this.sourceText = v
		})
		.catch(err => {
			console.warn("extension(22) - err:", err)
			return this.sourceText = selectText;
		})
		.then(() => {
			window.showInputBox()
			.then(str => {
				let readfile = fs.readFileSync(destFileFullPath, 'utf8').split('\n').map(v => v.trimRight()).filter(e => e);

				let updateFile = readfile.map(v => {
					if(!v.includes('{') && !v.includes('}') && v[v.length - 1] != ',') return `${v},`
					return v
				})

				if(sourceText.indexOf('"') != 0 && sourceText.indexOf('"') != sourceText.length - 1) {
					sourceText = `"${sourceText}"`.replace(/\'/gi, '')
				}

				let updateText = `\t"${str}": ${sourceText}`
				updateFile.splice(updateFile.length - 1, 0, updateText);
				let spliceFile = updateFile.join('\n')

				fs.writeFileSync(destFileFullPath, spliceFile, 'utf8');

				editor.edit(builder => {
					let stringPos = editor.selection.active;
					let startPos = new Position(stringPos.line, stringPos.character)
					builder.replace(editor.selection, `Strings.${str}`)
				})
			})
		})

		vscode.window.showInformationMessage('Data Write Done!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	// deactivate
}
