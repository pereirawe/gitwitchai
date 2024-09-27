import * as vscode from "vscode";
import axios from "axios";

export default async function verifyOpenAIToken(): Promise<boolean> {
    const token = vscode.workspace
        .getConfiguration()
        .get("gitwitchai.openai.token");

    if (!token) {
        vscode.window.showErrorMessage("OpenAI token is not set.");
        return false;
    }

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
        console.error("Error verifying OpenAI token:", error);
        vscode.window.showErrorMessage(
            "Failed to verify OpenAI token. Please check your token."
        );
        return false;
    }
}
