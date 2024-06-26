import { Uri, window, workspace } from "vscode";
import { getConfiguration } from "./config";
import { TargetDatabase } from "./type/target_database";

/**
 * Shows a pick list using window.showQuickPick().
 */
export async function showQuickPick() {
  let i = 0;
  const result = await window.showQuickPick(["one", "two", "three"], {
    placeHolder: "one, two or three",
    onDidSelectItem: (item) =>
      window.showInformationMessage(`Focus ${++i}: ${item}`),
  });
  window.showInformationMessage(`Got: ${result}`);
}

/**
 * Shows an input box using window.showInputBox().
 */
// export async function generateModule() {
//   const wdConfig = await getConfiguration();
//   if (wdConfig) {
//     const result = await window.showInputBox({
//       value: "",
//       // valueSelection: [2, 4],
//       placeHolder: "Input Module name: Helmet",
//       // validateInput: (text) => {
//       //   return text === "123" ? "Not 123!" : null;
//       // },
//     });

//     if (workspace.workspaceFolders) {
//       if (result) {
//         const moduleFolderName = result.toLowerCase();
//         const path = Uri.joinPath(
//           workspace.workspaceFolders[0].uri,
//           wdConfig.modulePath,
//           moduleFolderName
//         );
//         workspace.fs.createDirectory(path);

//         workspace.fs.writeFile(
//           Uri.joinPath(path, "module.ts"),
//           Buffer.from(module(result))
//         );
//         workspace.fs.writeFile(
//           Uri.joinPath(path, "controller.ts"),
//           Buffer.from(controller(result))
//         );
//         writeFile(path, "model.ts", model(result, wdConfig.targetDatabase));
//         window.showInformationMessage(`module ${result} created`);
//       } else {
//         window.showErrorMessage("Error module name");
//       }
//     }
//   }
// }
