class Settings {
  constructor() {
		const configuration = vscode.workspace.getConfiguration("sort-string-2-json", undefined);

    this.isStringFromClipboard = configuration.get("isStringFromClipboard");
    if (typeof this.isStringFromClipboard !== "boolean") {
        throw new Error("isStringFromClipboard is not a boolean");
    }
    this.destPath = configuration.get("destPath");
    if (typeof this.destPath !== "string") {
        throw new Error("destPath is not a string");
    }
    this.destFileName = configuration.get("destFileName");
    if (typeof this.destFileName !== "string") {
        throw new Error("destFileName is not a string");
    }
    this.isAccuratelySearch = configuration.get("isAccuratelySearch");
    if (typeof this.isAccuratelySearch !== "boolean") {
        throw new Error("isAccuratelySearch is not a boolean");
    }
  }
}
exports.default = Settings;