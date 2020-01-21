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
		clipboard.readText()
		.then(v => {
			if(!copyFromClipboard) return Promise.reject();
			return this.sourceText = v
		})
		.catch(err => {
			console.warn("extension(22) - err:", err)
			return this.sourceText = selectText;
		})
		.then(() => {
			return window.showInputBox()
			.then(str => {
				let readfile = fs.readFileSync(destFileFullPath, 'utf8').split('\n').map(v => v.trimRight()).filter(e => e);

				let updateFile = readfile.map(v => {
					if(!v.includes('{') && !v.includes('}') && v[v.length - 1] != ',') return `${v},`
					return v
				})

				if(this.sourceText.indexOf('"') != 0 && this.sourceText.indexOf('"') != this.sourceText.length - 1) {
					this.sourceText = `"${this.sourceText}"`.replace(/\'/gi, '')
				}

				let updateText = `\t"${str}": ${this.sourceText}`
				updateFile.splice(updateFile.length - 1, 0, updateText);

				return {
					spliceFile: updateFile.join('\n'), 
					str: str,
				};
			})
		})
		.then(({spliceFile, str}) => {
			editor.edit(builder => {
				let stringPos = editor.selection.active;
				let startPos = new Position(stringPos.line, stringPos.character)
				builder.replace(editor.selection, `Strings.${str}`)
				fs.writeFileSync(destFileFullPath, spliceFile, 'utf8');
				vscode.window.showInformationMessage('Data Write Done!');
			})
		})

	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	// deactivate
}
