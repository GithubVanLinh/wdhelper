export interface ControllerProperties {
  authDecorator?: string;
  name: string;
  controllerPath: string;
  serviceName: string;
  serviceInstanceName: string;
  dto: {
    createDto: string;
    updateDto: string;
    findDto: string;
  };
}

export default ({
  authDecorator = "User",
  controllerPath,
  name,
  serviceInstanceName,
  serviceName,
  dto: { createDto, findDto, updateDto },
}: ControllerProperties) => {
  const authDecoratorText = authDecorator
    ? `@${authDecorator}() ${authDecorator.toLowerCase()}: string`
    : "";
  return `
import { Controller, Post, Get, Patch, Delete, Body, Param, Query } from "@nestjs/common";
import { ${serviceName} } from "./service";
import { ${createDto} } from "./dto/create";
import { ${findDto} } from "./dto/find";
import { ${updateDto} } from "./dto/update";

@Controller("${controllerPath}")
export class ${name} {
  constructor(private ${serviceInstanceName}: ${serviceName}){}

  @Post("/")
  async create(${authDecoratorText}, @Body() body: ${createDto}){
    return await this.${serviceInstanceName}.create(body);
  }

  @Patch("/:id")
  async update(${authDecoratorText}, @Param("id") id: string, @Body() body: ${updateDto}) {
    return await this.${serviceInstanceName}.update(id, body);
  }

  @Delete("/:id")
  async delete(${authDecoratorText}, @Param("id") id: string) {
    return await this.${serviceInstanceName}.delete(id);
  }

  @Get("/")
  async find(${authDecoratorText}, @Query() query: ${findDto}) {
    return await this.${serviceInstanceName}.find(query);
  }

  @Get("/:id")
  async findOne(${authDecoratorText}, @Param("id") id: string) {
    return await this.${serviceInstanceName}.findOne(id);
  }
}
`;
};
