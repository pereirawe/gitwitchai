import * as vscode from "vscode";
import axios from "axios";

export default async function verifyOpenAIToken(
    token: string
): Promise<boolean> {
    if (!token) {
        vscode.window.showErrorMessage("OpenAI token is not set.");
        return false;
    }

    try {
        vscode.window.setStatusBarMessage("Validating OpenAI token.");
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                max_tokens: 5,
                messages: [{ role: "user", content: "1" }],
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        vscode.window.setStatusBarMessage("");
        return response.status === 200;
    } catch (error) {
        vscode.window.setStatusBarMessage("");
        console.error("Error verifying OpenAI token:", error);
        vscode.window.showErrorMessage(
            "Failed to verify OpenAI token. Please check your token."
        );
        return false;
    }
}
