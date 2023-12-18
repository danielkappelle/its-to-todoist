import 'dotenv/config';
import { logger } from './logger';
import { ItsToTodoist } from './its-to-todoist';
import * as cron from 'node-cron';

(async () => {
  logger.info('Script started');
  const app = new ItsToTodoist();
  await app.init();

  cron.schedule('* * * * *', async () => {
    logger.info('Sync!');
    await app.sync();
  });
})();
