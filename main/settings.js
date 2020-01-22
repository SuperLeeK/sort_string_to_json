class Settings {
  constructor() {
		const configuration = vscode.workspace.getConfiguration("sort-string-2-json", undefined);

    this.copyType = configuration.get("copyFromClipboard");
    if (typeof this.copyType !== "boolean") {
        throw new Error("copyFromClipboard is not a boolean");
    }
    this.destPath = configuration.get("destPath");
    if (typeof this.destPath !== "string") {
        throw new Error("destPath is not a string");
    }
    this.destFileName = configuration.get("destFileName");
    if (typeof this.destFileName !== "string") {
        throw new Error("destFileName is not a string");
    }
    this.exactlyMatch = configuration.get("exactlyMatch");
    if (typeof this.exactlyMatch !== "boolean") {
        throw new Error("exactlyMatch is not a boolean");
    }
  }
}
exports.default = Settings;