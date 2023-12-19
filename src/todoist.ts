import { Task, TodoistApi } from '@doist/todoist-api-typescript';
import { Task as ItsTask } from './interfaces';
import { logger } from './logger';

export class TodoistWrapper {
  api: TodoistApi;
  projectId: string;
  tasks: Task[];

  constructor() {
    this.api = new TodoistApi(process.env['TODOIST_API_TOKEN']);
  }

  async init() {
    logger.verbose('TodoistWrapper init');
    await this.setProject();
    await this.getExistingTasks();
  }

  async addTasks(tasks: ItsTask[]) {
    for (const task of tasks) {
      const content = `[${task.courseTitle}] ${task.taskTitle}`;
      const existingTask = this.tasks.find((task) => task.content === content);
      if (existingTask) {
        logger.info(`Skipped existing task with id ${existingTask.id}`);
        continue;
      }

      logger.debug(task);

      const newTask = await this.api.addTask({
        content,
        description: `[Open on ITS](${task.taskUrl})`,
        projectId: this.projectId,
        dueDatetime: task.deadline.toISOString(),
      });
      this.tasks.push(newTask);

      logger.info(`Added new task with id ${newTask.id}`);
      logger.debug(newTask);
    }
  }

  private async getExistingTasks() {
    this.tasks = await this.api.getTasks({ projectId: this.projectId });
  }

  private async setProject() {
    const projects = await this.api.getProjects();
    const projId = process.env['TODOIST_PROJECT_ID'];

    if (!projId) {
      this.projectId = projects[0].id;
      logger.warn('Using default project');
    } else {
      this.projectId = projId;
    }
  }
}
