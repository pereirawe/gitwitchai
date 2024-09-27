import * as vscode from "vscode";
import simpleGit from "simple-git";

export default async function getGitDiff() {
    const git = simpleGit(vscode.workspace.rootPath!);

    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
        vscode.window.showErrorMessage("Not a git repository.");
        return null;
    }
    const diffSummary = await git.diffSummary();
    if (diffSummary.files.length === 0) {
        vscode.window.showInformationMessage(
            "No changes detected in the repository."
        );
        return null;
    }

    const summary = diffSummary.files.map((file) => file.file).join("\n");
    return summary;
}
