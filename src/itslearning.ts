import puppeteer, { HTTPRequest } from 'puppeteer';
import { Task } from './interfaces';

type TaskCb = (value: Task[]) => void;

export class ItsLearning {
  constructor() {
    if (!process.env['USERNAME'] || !process.env['PASSWORD']) {
      console.error('Make sure to set up env vars USERNAME and PASSWORD');
      process.exit(1);
    }
  }

  private parseTasks(raw: any): Task[] {
    const entities = (raw.EntityArray as any[]).reduce(
      (prev, cur) => [...prev, ...cur.TaskDailyWorkflow.EntityArray],
      []
    );

    return entities.map((entity: any) => ({
      courseTitle: entity.CourseTitle,
      deadline: new Date(entity.Deadline),
      taskTitle: entity.TaskTitle,
      taskUrl: entity.TaskUrl,
    }));
  }

  private async handleRequest(request: HTTPRequest, cb: TaskCb) {
    if (request.url().includes('tasklistdailyworkflow')) {
      const unparsedTasks = await request.response().json();
      const tasks = this.parseTasks(unparsedTasks);
      cb(tasks);
    }
  }

  async getTasks(): Promise<Task[]> {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    const tasks = await new Promise<Task[]>(async (resolve, reject) => {
      page.on('requestfinished', (req) => this.handleRequest(req, resolve));

      await page.goto('https://kls.itslearning.com/');
      await page.type(
        '#prom-input-UsernameField',
        process.env['USERNAME'] as string
      );
      await page.type(
        '#password-PasswordField',
        process.env['PASSWORD'] as string
      );

      await page.click('#NativeLoginButton');
      await page.waitForSelector('#personal-menu-link');
      await page.goto(
        'https://kls.itslearning.com/Dashboard/Dashboard.aspx?LocationType=Personal&DashboardType=MyPage'
      );
    });

    await browser.close();
    return tasks;
  }
}
