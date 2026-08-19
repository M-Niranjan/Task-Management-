import { TasksService } from './tasks.service';
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
    findAll(projectId?: string): Promise<import("./task.schema").Task[]>;
    findOne(id: string): Promise<import("./task.schema").Task>;
    create(body: object): Promise<import("./task.schema").Task>;
    update(id: string, body: object): Promise<import("./task.schema").Task>;
    delete(id: string): Promise<void>;
    addComment(id: string, body: {
        content: string;
        author?: object;
    }): Promise<import("./task.schema").Task>;
}
