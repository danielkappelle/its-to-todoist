import { ItsLearning } from './itslearning';
import { logger } from './logger';
import { TodoistWrapper } from './todoist';

export class ItsToTodoist {
  its: ItsLearning;
  todo: TodoistWrapper;

  async init() {
    logger.verbose('ItsToTodoist init');
    this.its = new ItsLearning();
    this.todo = new TodoistWrapper();
    await this.todo.init();
  }

  async sync() {
    logger.info('Getting tasks');
    const tasks = await this.its.getTasks();
    logger.info(`Found ${tasks.length} tasks`);

    await this.todo.addTasks(tasks);
  }
}
