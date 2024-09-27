import * as vscode from "vscode";

export function setOpenAIToken(context: vscode.ExtensionContext) {
    const setOpenAIToken = vscode.commands.registerCommand(
        "gitwitchai.setOpenAIToken",
        async () => {
            const token = await vscode.window.showInputBox({
                prompt: "Enter your OpenAI API token",
            });
            if (token) {
                await vscode.workspace
                    .getConfiguration()
                    .update(
                        "gitwitchai.openai.token",
                        token,
                        vscode.ConfigurationTarget.Global
                    );
                vscode.window.showInformationMessage("OpenAI token set!");
            }
        }
    );

    context.subscriptions.push(setOpenAIToken);
}
