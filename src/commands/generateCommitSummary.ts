import * as vscode from "vscode";
import axios from "axios";

export default async function generateCommitSummary(
    diff: string
): Promise<string | null> {
    const token = vscode.workspace
        .getConfiguration()
        .get("gitwitchai.openai.token");
    if (!token) {
        vscode.window.showErrorMessage("OpenAI token is not set!");
        return null;
    }

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                max_tokens: 150,
                messages: [
                    {
                        role: "user",
                        content: `Summarize and create a git commit message for the following git diff:\n\n${diff}`,
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data.choices[0].text;
    } catch (error) {
        // Cast the error as an Error to safely access its properties
        const errMessage = (error as Error).message || "Unknown error occurred";
        vscode.window.showErrorMessage(
            `Error generating commit message from OpenAI: ${errMessage}`
        );
        return null;
    }
}
