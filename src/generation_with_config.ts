import { workspace, Uri, window } from "vscode";
import { getConfiguration } from "./config";
import module from "./template/module";
import controller from "./template/controller";
import mongoService from "./template/service/mongo";
import mongoModel from "./template/database/mongo";
import { TargetDatabase } from "./type/target_database";
import { writeFile } from "./helpers/write_file";
import dto from "./template/dto";

export async function generateModuleFromConfig() {
  const wdConfig = await getConfiguration();
  console.log("src/basicInput.ts", "config", wdConfig);

  if (workspace.workspaceFolders && wdConfig) {
    const listModule = wdConfig.configSchema.module;
    for (const mod of listModule) {
      const name = mod.name;
      //define name
      const moduleFolderName = name.toLowerCase();

      const rootPath = Uri.joinPath(
        workspace.workspaceFolders[0].uri,
        wdConfig.modulePath,
        moduleFolderName
      );

      try {
        console.log("src/basicInput.ts", "modFolder");
        const modFolder = await workspace.fs.readDirectory(rootPath);
        window.showInformationMessage(
          `module ${name} already exists. Nothing to create!`
        );
      } catch (e) {
        const moduleName = `${name}Module`;
        const controllerName = `${name}Controller`;
        const serviceName = `${name}Service`;
        const serviceInstanceName = `${
          name[0].toLowerCase() + name.substring(1)
        }Serivce`;
        const modelName = name;
        const modelInstanceName = `${
          name[0].toLowerCase() + name.substring(1)
        }Model`;
        const createDtoName = `Create${name}Dto`;
        const updateDtoName = `Update${name}Dto`;
        const findDtoName = `Find${name}Dto`;

        const authDecorator = wdConfig.configSchema.auth.authDecorator;

        const dtoPath = Uri.joinPath(rootPath, "dto");
        //create list folders
        workspace.fs.createDirectory(rootPath);
        workspace.fs.createDirectory(dtoPath);

        //create file in root
        writeFile(
          rootPath,
          "module.ts",
          module({
            modelName: modelName,
            controllerName: controllerName,
            serviceName: serviceName,
            moduleName: moduleName,
          })
        );
        writeFile(
          rootPath,
          "controller.ts",
          controller({
            authDecorator: authDecorator,
            name: controllerName,
            controllerPath: controllerName.toLowerCase(),
            serviceName: serviceName,
            serviceInstanceName: serviceInstanceName,
            dto: {
              createDto: createDtoName,
              findDto: findDtoName,
              updateDto: updateDtoName,
            },
          })
        );

        writeFile(dtoPath, "create.ts", dto(createDtoName, mod.schema));
        writeFile(dtoPath, "update.ts", dto(updateDtoName, mod.schema));
        writeFile(dtoPath, "find.ts", dto(findDtoName, mod.schema));

        if (wdConfig.targetDatabase === TargetDatabase.MONGODB) {
          writeFile(
            rootPath,
            "service.ts",
            mongoService({
              name: serviceName,
              modelName: modelName,
              modelInstanceName: modelInstanceName,
              dto: {
                createDto: createDtoName,
                findDto: findDtoName,
                updateDto: updateDtoName,
              },
            })
          );
          writeFile(rootPath, "model.ts", mongoModel(modelName, mod.schema));
        }

        window.showInformationMessage(`module ${name} created`);
      }
    }
  }
}
