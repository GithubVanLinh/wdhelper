export interface ModuleProperties {
  moduleName: string;
  controllerName: string;
  serviceName: string;
  modelName: string;
}

export default ({
  controllerName,
  moduleName,
  serviceName,
  modelName,
}: ModuleProperties) => {
  const modelSchema = `${modelName}Schema`;
  return `
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose';

import { ${modelName}, ${modelSchema}} from "./model.ts"
import { ${controllerName} } from "./controller"
import { ${serviceName} } from "./service"

@Module({
  import: [MongooseModule.forFeature([{ name: ${modelName}.name, schema: ${modelSchema} }])],
  controller: [${controllerName}],
  provider: [${serviceName}],
  export: [${serviceName}]
})
export class ${moduleName} {}
`;
};
