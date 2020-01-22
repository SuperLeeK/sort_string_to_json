const vscode = require('vscode');
const fs     = require('fs');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const { window, commands, env: { clipboard }, Position } = vscode;
	const { isStringFromClipboard, destPath, destFileName, isAccuratelySearch } = vscode.workspace.getConfiguration("update-string-to-string-id", undefined);


	let updateToString = vscode.commands.registerCommand('extension.updateStringToStringId', function () {
		let editor = window.activeTextEditor;
		let editorText = editor.document.getText();
		let selectText = editor.document.getText(editor.selection);
		this.sourceText = null;
		this.sourceArr = [];
		let destFileFullPath = `${destPath}/${destFileName}`;
		if(!editor) return;
		if(editor.selection.isEmpty) {
      window.showInformationMessage('Need to select any text!!')
      return;
    };

		clipboard.readText()
		.then(v => {
			if(!isStringFromClipboard) return Promise.reject();
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
				this.sourceText = this.sourceText.split('${').map(v=>v.split('}')).flat().map((v,i) => {
					if((i+1)%2 == 0) {
						this.sourceArr.push(v)
						return `{\%${Math.round(i/2)}}`
					}
					return v
				}).join('');

				let updateFile = readfile.map((v, i) => {
					if(i != 0 && i != readfile.length - 1 && v[v.length - 1] != ',' && !v.includes('/*') && !v.includes('*/')) return `${v},`
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
				builder.replace(editor.selection, this.sourceArr.length > 0 ? `Strings.${str}.format(${this.sourceArr.join(',')})` : `Strings.${str}`)
				fs.writeFileSync(destFileFullPath, spliceFile, 'utf8');
				this.sourceText = null;
			})
		})
	});

	let checkFromString = vscode.commands.registerCommand('extension.checkStringIdFromString', function () {
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
			if(!isStringFromClipboard) return Promise.reject();
			return this.sourceText = clip
		})
		.catch(err => {
			return this.sourceText = selectText;
		})
		.then(() => {
			this.sourceText = this.sourceText.replace(/\"/gi, '').replace(/\'/gi, '').replace(/\`/gi, '')
			let readfiles = fs.readFileSync(destFileFullPath, 'utf8').split('\n').filter(e => !(e.includes('/*') || e.includes('*/'))).filter(line => {
				if(isAccuratelySearch) {
					if((line.replace(':','|split|').split('|split|')[1] || '').trim().replace(/\"/gi,'').replace(/\,/gi,'') == this.sourceText) return true;
				} else {
					return line.includes(this.sourceText);
				}
			});
			let quickReadFiles = readfiles.map(v => {
				return v.replace(':','|split|').split('|split|')[0].trim();
			})
			if(readfiles.length < 1) window.showInformationMessage(`Can not found matched with "${this.sourceText}"`)
			else {
				window.showQuickPick(quickReadFiles)
				.then(pickText => {
					/** save the clipboard or editor */
					editor.edit(builder => {
						let stringPos = editor.selection.active;
						let startPos = new Position(stringPos.line, stringPos.character)
						let resultText = `Strings.${pickText.replace(/\"/gi,'')}`;
						builder.replace(editor.selection, resultText)
						// clipboard.writeText(resultText);
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
