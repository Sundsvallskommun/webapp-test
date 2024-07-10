import App from '@/app';
import { IndexController } from '@controllers/index.controller';
import validateEnv from '@utils/validateEnv';
import { UserController } from './controllers/user.controller';
import { SupportmanagementController } from './controllers/supportmanagement.controller';
import { SupportmanagementRolesController } from './controllers/supportmanagement.roles.controller';

validateEnv();

const app = new App([
  IndexController,
  UserController,
  SupportmanagementController,
  SupportmanagementRolesController
]);

app.listen();
