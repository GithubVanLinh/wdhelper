// The module ' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, Uri, commands, window, workspace } from "vscode";
// import * as {window} from "vscode";

import { generateModuleFromConfig } from "./generation_with_config";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "wd-nest-helpers" is now active!'
  );

  if (workspace.workspaceFolders) {
    context.subscriptions.push(
      commands.registerCommand("wd-nest-helpers.generate", async () => {
        const options: {
          [key: string]: (context: ExtensionContext) => Promise<void>;
        } = {
          generateModuleFromConfig,
          // showQuickPick,
          // generateModule,
          // multiStepInput,
        };
        const quickPick = window.createQuickPick();
        quickPick.items = Object.keys(options).map((label) => ({ label }));
        quickPick.onDidChangeSelection((selection) => {
          if (selection[0]) {
            options[selection[0].label](context).catch(console.error);
            if (selection[0].label === "generateModuleFromConfig") {
              quickPick.dispose();
            }
          }
        });
        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
      })
    );
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json

    // context.subscriptions.push(disposable);
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
