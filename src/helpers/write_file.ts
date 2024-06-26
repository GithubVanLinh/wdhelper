import { Uri, workspace } from "vscode";

export function writeFile(folder: Uri, name: string, data: string) {
  workspace.fs.writeFile(Uri.joinPath(folder, name), Buffer.from(data));
}
