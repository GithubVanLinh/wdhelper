export interface MongoServiceProperties {
  name: string;
  modelName: string;
  modelInstanceName: string;
  dto: {
    createDto: string;
    updateDto: string;
    findDto: string;
  };
}

export default ({
  modelInstanceName,
  modelName,
  name,
  dto: { createDto, findDto, updateDto },
}: MongoServiceProperties) => {
  return `
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SessionOption } from 'mongoose';

import { ${modelName} } from './model';
import { ${createDto} } from "./dto/create";
import { ${findDto} } from "./dto/find";
import { ${updateDto} } from "./dto/update";

@Injectable()
export class ${name} {
  constructor(
    @InjectModel(${modelName}.name)
    private ${modelInstanceName}: Model<${modelName}>,
  ) {}

  async create(body: ${createDto}, opt?: SessionOption){
    const newDoc = await this.${modelInstanceName}(body).save(opt);
    return newDoc;
  }

  async update(id: string, data: ${updateDto}, opt?: SessionOption){
    const oldDoc = await this.${modelInstanceName}.findByIdAndUpdate(id, data, opt);
    return oldDoc;
  }

  async findById(id: string, opt?: SessionOption){
    return await this.${modelInstanceName}.findById(id, null, opt);
  }

  async find(condition: ${findDto}, opt?: SessionOption){
    return await this.${modelInstanceName}.find(condition, null, opt)
  }

  async delete(id: string, opt?: SessionOption){
    return await this.${modelInstanceName}.findByIdAndDelete(id, opt)
  }
}
  `;
};
