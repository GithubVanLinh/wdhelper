import { TargetDatabase } from "./target_database";

export type JsonSchemaPropertyType = "string" | "number";
export type JsonSchema = {
  [key: string]: JsonSchemaPropertyType;
};

export type JsonSchemaModule = {
  name: string;
  schema: JsonSchema;
};

export type JsonSchemaAuth = {
  authDecorator: string;
};

export type JsonSchemaConfig = {
  module: JsonSchemaModule[];
  auth: JsonSchemaAuth;
};

export interface WdConfiguration {
  modulePath: string;
  targetDatabase: TargetDatabase;
  configSchema: JsonSchemaConfig;
}
