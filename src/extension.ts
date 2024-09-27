// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { setOpenAIToken } from "./commands/setOpenAIToken";
import { commitWithAI } from "./commands/commitWithAI";

export function activate(context: vscode.ExtensionContext) {
    setOpenAIToken(context);
    commitWithAI(context);
}

export function deactivate() {}
