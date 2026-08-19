import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private projectsService;
    constructor(projectsService: ProjectsService);
    findAll(): Promise<import("./project.schema").Project[]>;
    findOne(id: string): Promise<import("./project.schema").Project>;
    create(body: object): Promise<import("./project.schema").Project>;
    update(id: string, body: object): Promise<import("./project.schema").Project>;
    delete(id: string): Promise<void>;
}
