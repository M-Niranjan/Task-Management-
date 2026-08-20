import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.schema';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

  async findAll(): Promise<Project[]> {
    return this.projectModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectModel.findById(id).lean().exec();
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project as Project;
  }

  async create(data: Partial<Project>): Promise<Project> {
    const created = await this.projectModel.create(data);
    return created.toObject ? created.toObject() : created;
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const project = await this.projectModel
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec();
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project as Project;
  }

  async delete(id: string): Promise<void> {
    await this.projectModel.findByIdAndDelete(id).exec();
  }
}
