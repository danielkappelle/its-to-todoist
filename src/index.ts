import 'dotenv/config';
import { logger } from './logger';
import { ItsToTodoist } from './its-to-todoist';
import * as cron from 'node-cron';

(async () => {
  logger.info('Script started');
  logger.info(`Endpoint: ${process.env['ITS_BASE_URL']}`);
  const app = new ItsToTodoist();
  await app.init();
  logger.info('First sync');
  await app.sync();

  logger.info('Start cronjob');
  cron.schedule('0 * * * *', async () => {
    logger.info('Sync!');
    await app.sync();
  });
})();
