import * as vscode from "vscode";
import commitWithAISummary from "./commitWithAISummary";
import verifyOpenAIToken from "./verifyOpenAIToken";

export function commitWithAI(context: vscode.ExtensionContext) {
    let commitWithAI = vscode.commands.registerCommand(
        "gitwitchai.commitWithAI",
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
