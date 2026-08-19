import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async findAll(projectId?: string): Promise<Task[]> {
    const filter = projectId ? { projectId } : {};
    return this.taskModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async create(data: Partial<Task>): Promise<Task> {
    return this.taskModel.create(data);
  }

  async update(id: string, data: Partial<Task>): Promise<Task> {
    const task = await this.taskModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async delete(id: string): Promise<void> {
    await this.taskModel.findByIdAndDelete(id).exec();
  }

  async addComment(id: string, comment: object): Promise<Task> {
    const task = await this.taskModel
      .findByIdAndUpdate(id, { $push: { comments: comment } }, { new: true })
      .exec();
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }
}
