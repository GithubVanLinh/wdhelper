import { JsonSchema, JsonSchemaPropertyType } from "../../type/config";

export default (name: string, schema: JsonSchema) => {
  const modelName = name;
  const schemaName = `${name}Schema`;
  const documentName = `${name}Document`;

  const entries = Object.entries(schema);
  const properties = entries.map((entry) => {
    const [key, type] = entry;

    return getDefineType(key, type);
  });

  return `
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class ${modelName} extends BaseSchema {
${properties.join("\n\n")}
}


export type ${documentName} = HydratedDocument<${modelName}>;

export const ${schemaName} = SchemaFactory.createForClass(${modelName});
${schemaName}.pre('save', function (next) {
  const date = new Date();
  this.updatedAt = date;
  this.createdAt = date;
  next();
});
  `;
};

function getDefineType(key: string, type: JsonSchemaPropertyType) {
  const list = [];
  switch (type) {
    case "string":
      list.push(`\t@Prop({type: String})\n\t${key}: string;`);
      break;

    case "number":
      list.push(`\t@Prop({type: Number})\n\t${key}: number;`);
      break;

    default:
      break;
  }

  return list.join("\n");
}
