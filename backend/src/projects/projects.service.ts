import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.schema';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

  async findAll(): Promise<Project[]> {
    return this.projectModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectModel.findById(id).exec();
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async create(data: Partial<Project>): Promise<Project> {
    return this.projectModel.create(data);
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const project = await this.projectModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async delete(id: string): Promise<void> {
    await this.projectModel.findByIdAndDelete(id).exec();
  }
}
