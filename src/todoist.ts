import { Task, TodoistApi } from '@doist/todoist-api-typescript';
import { Task as ItsTask } from './interfaces';

export class TodoistWrapper {
  api: TodoistApi;
  projectId: string;
  tasks: Task[];

  constructor() {
    this.api = new TodoistApi(process.env['TODOIST_API_TOKEN']);
  }

  async init() {
    await this.setProject();
    await this.getExistingTasks();
  }

  async addTasks(tasks: ItsTask[]) {
    for (const task of tasks) {
      const content = `[${task.courseTitle}] ${task.taskTitle}`;
      const existingTask = this.tasks.find((task) => task.content === content);
      if (existingTask) {
        console.log(`> Skipped existing task with id ${existingTask.id}`);
        continue;
      }

      const newTask = await this.api.addTask({
        content,
        projectId: this.projectId,
        dueDatetime: task.deadline.toISOString(),
      });
      this.tasks.push(newTask);

      console.log(`> Added new task with id ${newTask.id}`);
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
      console.log('Warning: Using default project');
    } else {
      this.projectId = projId;
    }
  }
}
