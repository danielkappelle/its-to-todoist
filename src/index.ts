import 'dotenv/config';
import { ItsLearning } from './itslearning';
import { Task as ItsTask } from './interfaces';
import { TodoistWrapper } from './todoist';

(async () => {
  const its = new ItsLearning();
  const todo = new TodoistWrapper();
  await todo.init();

  console.log('> Getting tasks');
  const tasks = await its.getTasks();
  console.log(`> Found ${tasks.length} tasks`);

  await todo.addTasks(tasks);
})();
