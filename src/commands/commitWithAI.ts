import * as vscode from "vscode";
import commitWithAISummary from "./commitWithAISummary";
import verifyOpenAIToken from "./tokens/verifyOpenAIToken";
import { getOpenAIToken } from "./tokens/getOpenAiToken";

export function commitWithAI(context: vscode.ExtensionContext) {
    let commitWithAI = vscode.commands.registerCommand(
        "gitwitchai.commitWithAI",
        async () => {
            const token = await getOpenAIToken();
            if (!token) {
                vscode.window.showErrorMessage("OpenAI token not found.");
                return;
            }
            if (await verifyOpenAIToken(token)) {
                await commitWithAISummary();
            } else {
                vscode.window.showErrorMessage("Invalid OpenAI token.");
            }
        }
    );

    context.subscriptions.push(commitWithAI);
}
