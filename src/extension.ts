// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import axios from "axios";
import simpleGit from "simple-git";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "witchai" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand(
        "witchai.helloWorld",
        () => {
            // The code you place here will be executed every time your command is executed
            // Display a message box to the user
            vscode.window.showInformationMessage("Hello World from WitchAI!");
        }
    );

    context.subscriptions.push(disposable);

    let setOpenAIToken = vscode.commands.registerCommand(
        "witchai.setOpenAIToken",
        async () => {
            const token = await vscode.window.showInputBox({
                prompt: "Enter your OpenAI API token",
            });
            if (token) {
                await vscode.workspace
                    .getConfiguration()
                    .update(
                        "openai.token",
                        token,
                        vscode.ConfigurationTarget.Global
                    );
                vscode.window.showInformationMessage("OpenAI token set!");
            }
        }
    );

    context.subscriptions.push(setOpenAIToken);

    let commitWithAI = vscode.commands.registerCommand(
        "witchai.commitWithAI",
        async () => {
            if (await verifyOpenAIToken()) {
                await commitWithAISummary();
            } else {
                vscode.window.showErrorMessage("Invalid OpenAI token.");
            }
        }
    );

    context.subscriptions.push(commitWithAI);
}

async function verifyOpenAIToken() {
    const token = vscode.workspace.getConfiguration().get("openai.token");

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                max_tokens: 5,
                messages: [{ role: "user", content: "Test" }],
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.status === 200;
    } catch (error) {
        return false;
    }
}

async function getGitDiff() {
    const git = simpleGit(vscode.workspace.rootPath!);

    console.log(vscode.workspace.rootPath!);
    console.log(vscode.workspace.workspaceFolders![0].uri.fsPath);

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
    console.log(summary);
    return summary;
}

async function generateCommitSummary(diff: string): Promise<string | null> {
    const token = vscode.workspace.getConfiguration().get("openai.token");
    if (!token) {
        vscode.window.showErrorMessage("OpenAI token is not set!");
        return null;
    }

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/completions",
            {
                model: "text-davinci-003",
                prompt: `Summarize the following git diff:\n\n${diff}`,
                max_tokens: 150,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data.choices[0].text.trim();
    } catch (error) {
        // Cast the error as an Error to safely access its properties
        const errMessage = (error as Error).message || "Unknown error occurred";
        vscode.window.showErrorMessage(
            `Error generating commit message from OpenAI: ${errMessage}`
        );
        return null;
    }
}

async function commitWithAISummary() {
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
            }
        }
    );
}

// This method is called when your extension is deactivated
export function deactivate() {}
