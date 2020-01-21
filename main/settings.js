class Settings {
  constructor() {
		const configuration = vscode.workspace.getConfiguration("sort-string-2-json", undefined);

    this.copyType = configuration.get("copyFromClipboard");
    if (typeof this.rulerPosition !== "string") {
        throw new Error("copyFromClipboard is not a string");
    }
    this.destPath = configuration.get("destPath");
    if (typeof this.rulerPosition !== "string") {
        throw new Error("destPath is not a string");
    }
    this.destFileName = configuration.get("destFileName");
    if (typeof this.rulerPosition !== "string") {
        throw new Error("destFileName is not a string");
    }
  }
}
exports.default = Settings;