import * as vscode from "vscode";
import simpleGit from "simple-git";
import getGitDiff from "./getGitDiff";
import generateCommitSummary from "./generateCommitSummary";

export default async function commitWithAISummary() {
    vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: "Generating commit message with AI",
            cancellable: false,
        },
        async () => {
            const git = simpleGit(vscode.workspace.rootPath!);
            const diff = await getGitDiff();

            if (!diff) {
                vscode.window.showErrorMessage("No changes to commit.");
                return;
            }

            const aiSummary = await generateCommitSummary(diff);

            if (aiSummary) {
                await git.commit(aiSummary);
                vscode.window.showInformationMessage(
                    `Committed with message: ${aiSummary}`
                );
            } else {
                vscode.window.showErrorMessage(
                    "Failed to generate commit summary with AI."
                );
            }
        }
    );
}
