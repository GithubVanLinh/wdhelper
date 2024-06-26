import { workspace, window, Uri } from "vscode";
import { JsonSchemaConfig, WdConfiguration } from "./type/config";
import { TargetDatabase } from "./type/target_database";
import defaultConfig from "./template/wdConfig.json";

export async function getConfiguration(): Promise<WdConfiguration | null> {
  console.log("in Check");

  const configWd = workspace.getConfiguration("wd");

  const moduleFolder = configWd.get<string>("moduleFolder");
  const targetDatabase = configWd.get<TargetDatabase>("targetDatabase");

  if (!moduleFolder || !targetDatabase) {
    window.showErrorMessage("missing wdConfig");
    return null;
  }

  const configPath = "wdConfig.json";

  if (workspace.workspaceFolders) {
    const path = Uri.joinPath(workspace.workspaceFolders[0].uri, configPath);

    let configData: JsonSchemaConfig;
    try {
      configData = JSON.parse((await workspace.fs.readFile(path)).toString());
      console.log("src/extension.ts", "configData", configData);
      const res = workspace.getConfiguration("wd");
      console.log("src/extension.ts", "res", res);
    } catch (e) {
      await workspace.fs.writeFile(
        path,
        Buffer.from(JSON.stringify(defaultConfig))
      );
      configData = defaultConfig;
    }

    const schema = configData.module;
    console.log(schema);

    return {
      modulePath: moduleFolder,
      targetDatabase: targetDatabase,
      configSchema: configData,
    };
  } else {
    window.showErrorMessage("Missing WorkspaceFolder");
  }

  return null;
}
