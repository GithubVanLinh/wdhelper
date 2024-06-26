import { JsonSchemaPropertyType } from "../type/config";

export default (name: string, property: any) => {
  const entries = Object.entries<JsonSchemaPropertyType>(property);
  const strs = entries.map((entry) => {
    const [propName, type] = entry;

    return `${getValidateKey(type)}\n\t${propName}: ${type}`;
  });

  return `
import { IsOptional, IsString, IsNumber } from "class-validator";

export class ${name} {
${strs.join("\n\n")}
}
  `;
};

function getValidateKey(type: JsonSchemaPropertyType) {
  const validateKey = ["\t@IsOptional()"];
  switch (type) {
    case "string":
      validateKey.push("\t@IsString()");
      break;
    case "number":
      validateKey.push("\t@IsNumber()");
      break;
    default:
      break;
  }

  return validateKey.join("\n");
}
