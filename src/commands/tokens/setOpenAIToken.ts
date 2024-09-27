import * as vscode from "vscode";
import verifyOpenAIToken from "./verifyOpenAIToken";

export function setOpenAIToken(context: vscode.ExtensionContext) {
    const command = vscode.commands.registerCommand(
        "gitwitchai.setOpenAIToken",
        async () => {
            try {
                const token = await vscode.window.showInputBox({
                    prompt: "Enter your OpenAI API token",
                    ignoreFocusOut: true,
                });

                if (!token) {
                    return vscode.window.showErrorMessage("No token provided.");
                }

                const tokenIsValid = await verifyOpenAIToken(token);

                if (!tokenIsValid) {
                    return vscode.window.showErrorMessage(
                        "The provided OpenAI token is invalid. Please check your token."
                    );
                }

                await vscode.workspace
                    .getConfiguration()
                    .update(
                        "gitwitchai.openai.token",
                        token,
                        vscode.ConfigurationTarget.Global
                    );

                vscode.window.showInformationMessage(
                    "OpenAI token has been successfully set!"
                );
                return true;
            } catch (error) {
                let errorMessage = "An unknown error occurred.";

                if (error instanceof Error) {
                    errorMessage = error.message;
                } else if (typeof error === "string") {
                    errorMessage = error;
                }

                vscode.window.showErrorMessage(
                    `Failed to set OpenAI token: ${errorMessage}`
                );
                return false;
            }
        }
    );

    // Register the command within the extension context
    context.subscriptions.push(command);
}
