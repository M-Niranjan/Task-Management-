import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';
export declare class TasksService {
    private taskModel;
    constructor(taskModel: Model<TaskDocument>);
    findAll(projectId?: string): Promise<Task[]>;
    findOne(id: string): Promise<Task>;
    create(data: Partial<Task>): Promise<Task>;
    update(id: string, data: Partial<Task>): Promise<Task>;
    delete(id: string): Promise<void>;
    addComment(id: string, comment: object): Promise<Task>;
}
