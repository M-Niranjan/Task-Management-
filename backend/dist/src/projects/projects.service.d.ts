import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.schema';
export declare class ProjectsService {
    private projectModel;
    constructor(projectModel: Model<ProjectDocument>);
    findAll(): Promise<Project[]>;
    findOne(id: string): Promise<Project>;
    create(data: Partial<Project>): Promise<Project>;
    update(id: string, data: Partial<Project>): Promise<Project>;
    delete(id: string): Promise<void>;
}
