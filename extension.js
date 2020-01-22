const vscode = require('vscode');
const fs     = require('fs');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const { window, commands, env: { clipboard }, Position } = vscode;
	const { copyFromClipboard, destPath, destFileName } = vscode.workspace.getConfiguration("sort-string-2-json", undefined);


	let updateToString = vscode.commands.registerCommand('extension.sortString', function () {
		let editor = window.activeTextEditor;
		let editorText = editor.document.getText();
		let selectText = editor.document.getText(editor.selection);
		this.sourceText = null;
		let destFileFullPath = `${destPath}/${destFileName}`;
		if(!editor) return;
		if(editor.selection.isEmpty) {
      window.showInformationMessage('Need to select any text!!')
      return;
    };

		clipboard.readText()
		.then(v => {
			if(!copyFromClipboard) return Promise.reject();
			return this.sourceText = v
		})
		.catch(err => {
			return this.sourceText = selectText;
		})
		.then(() => {
			return window.showInputBox()
			.then(str => {
				if(!str) return Promise.reject('noStr');
				str = str.replace(/ /gi, '_')
				let readfile = fs.readFileSync(destFileFullPath, 'utf8').split('\n').map(v => v.trimRight()).filter(e => e);

				let updateFile = readfile.map(v => {
					if(!v.includes('{') && !v.includes('}') && v[v.length - 1] != ',') return `${v},`
					return v
				})

				if(this.sourceText.indexOf('"') != 0 && this.sourceText.indexOf('"') != this.sourceText.length - 1) {
					this.sourceText = `"${this.sourceText}"`.replace(/\'/gi, '').replace(/\`/gi, '')
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
				this.sourceText = null;
			})
		})
	});

	let checkFromString = vscode.commands.registerCommand('extension.checkString', function () {
		let editor = window.activeTextEditor;
		let editorText = editor.document.getText();
		let selectText = editor.document.getText(editor.selection);
		this.sourceText = null;
		let destFileFullPath = `${destPath}/${destFileName}`;

		if(!editor) return;
		if(editor.selection.isEmpty) {
      window.showInformationMessage('Need to select any text!!')
      return;
    };

		clipboard.readText()
		.then(clip => {
			if(!copyFromClipboard) return Promise.reject();
			return this.sourceText = clip
		})
		.catch(err => {
			return this.sourceText = selectText;
		})
		.then(() => {
			this.sourceText = this.sourceText.replace(/\"/gi, '').replace(/\'/gi, '').replace(/\`/gi, '')
			let readfiles = fs.readFileSync(destFileFullPath, 'utf8').split('\n').filter(e => !(e.includes('/*') || e.includes('*/'))).filter(line => line.includes(this.sourceText));
			let quickReadFiles = readfiles.map(v => {
				return v.replace(':','|split|').split('|split|')[0].trim();
			})
			if(readfiles.length < 1) window.showInformationMessage(`Can not found matched with ${this.sourceText}`)
			else {
				window.showQuickPick(quickReadFiles)
				.then(pickText => {
					/** save the clipboard or editor */
					editor.edit(builder => {
						let stringPos = editor.selection.active;
						let startPos = new Position(stringPos.line, stringPos.character)
						let resultText = `Strings.${pickText.replace(/\"/gi,'')}`;
						builder.replace(editor.selection, resultText)
						clipboard.writeText(resultText);
					})
				})
			}
		})
	})

	context.subscriptions.push(updateToString);
	context.subscriptions.push(checkFromString);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate,
	// Strings
}
