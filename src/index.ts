import 'dotenv/config';
import { logger } from './logger';
import { ItsToTodoist } from './its-to-todoist';

(async () => {
  logger.info('Script started');
  const app = new ItsToTodoist();
  await app.init();
  await app.sync();
  logger.info('All done!');
})();
