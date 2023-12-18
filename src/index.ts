import 'dotenv/config';
import { ItsLearning } from './itslearning';

(async () => {
  const its = new ItsLearning();

  console.log('> Getting tasks');
  const tasks = await its.getTasks();
  console.log(tasks);
})();
