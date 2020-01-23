class Settings {
  constructor() {
		const configuration = vscode.workspace.getConfiguration("update-string-to-string-id", undefined);

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
    this.toStringCase = configuration.get("toStringCase");
    if (typeof this.toStringCase !== "string") {
        throw new Error("toStringCase is not a string");
    }
  }
}
exports.default = Settings;