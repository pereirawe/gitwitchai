import * as vscode from "vscode";

export async function getOpenAIToken(): Promise<string | undefined> {
    return vscode.workspace
        .getConfiguration()
        .get<string>("gitwitchai.openai.token");
}
