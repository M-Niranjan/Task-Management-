import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  findAll(@Query('projectId') projectId?: string) {
    return this.tasksService.findAll(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() body: object) {
    return this.tasksService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: object) {
    return this.tasksService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() body: { content: string; author?: object }) {
    const comment = {
      _id: new Date().getTime().toString(),
      content: body.content,
      author: body.author || { name: 'Guest', initials: 'GU' },
      createdAt: new Date().toISOString(),
    };
    return this.tasksService.addComment(id, comment);
  }
}
