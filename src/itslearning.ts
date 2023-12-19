import { Task } from './interfaces';
import { logger } from './logger';
import { parse } from 'node-html-parser';

export class ItsLearning {
  cookies: string;
  username: string;
  password: string;
  baseUrl: string;

  constructor() {
    if (!process.env['USERNAME'] || !process.env['PASSWORD']) {
      logger.error('Make sure to set up env vars USERNAME and PASSWORD');
      process.exit(1);
    }

    if (!process.env['ITS_BASE_URL']) {
      logger.error(
        `Make sure to set the ITS_BASE_URL env var (don't end with a /)`
      );
      process.exit(2);
    }

    this.username = process.env['USERNAME'];
    this.password = process.env['PASSWORD'];
    this.baseUrl = process.env['ITS_BASE_URL'];
  }

  private parseCookies(response: Response) {
    const raw = response.headers.getSetCookie();
    return raw
      .map((entry) => {
        const parts = entry.split(';');
        const cookiePart = parts[0];
        return cookiePart;
      })
      .join(';');
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

  private async getBodyParams() {
    const res = await fetch(`${this.baseUrl}/index.aspx`, {
      method: 'GET',
    });

    this.cookies = this.parseCookies(res);
    const root = parse(await res.text());

    const viewState = root.querySelector('#__VIEWSTATE').getAttribute('value');
    const eventValidation = root
      .querySelector('#__EVENTVALIDATION')
      .getAttribute('value');
    const viewStateGenerator = root
      .querySelector('#__VIEWSTATEGENERATOR')
      .getAttribute('value');

    const body = new URLSearchParams();
    body.append('__EVENTTARGET', '__Page');
    body.append('__EVENTARGUMENT', 'NativeLoginButtonClicked');
    body.append('__VIEWSTATE', viewState);
    body.append('__VIEWSTATEGENERATOR', viewStateGenerator);
    body.append('__EVENTVALIDATION', eventValidation);
    body.append('ctl00$ContentPlaceHolder1$Username', this.username);
    body.append('ctl00$ContentPlaceHolder1$Password', this.password);
    body.append('ctl00$ContentPlaceHolder1$ChromebookApp', 'false');
    body.append('ctl00$ContentPlaceHolder1$showNativeLoginValueField', '');
    return body;
  }

  private async login(body: URLSearchParams) {
    await fetch(`${this.baseUrl}/index.aspx`, {
      method: 'POST',
      body: body.toString(),
      headers: {
        cookie: this.cookies,
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
  }

  private async fetchTasks(): Promise<Response> {
    return await fetch(
      `${this.baseUrl}/restapi/personal/tasklistdailyworkflow/v1?PageIndex=0&PageSize=100`,
      {
        method: 'GET',
        headers: {
          cookie: this.cookies,
        },
      }
    );
  }

  async getTasks(): Promise<Task[]> {
    const body = await this.getBodyParams();
    await this.login(body);
    const rawTasks = await this.fetchTasks();
    const rawTasksJson = await rawTasks.json();
    logger.debug(rawTasksJson);
    return this.parseTasks(rawTasksJson);
  }
}
