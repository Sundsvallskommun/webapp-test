import App from '@/app';
import { IndexController } from '@controllers/index.controller';
import validateEnv from '@utils/validateEnv';
import { UserController } from './controllers/user.controller';
import { SupportmanagementController } from './controllers/supportmanagement.controller';
import { SupportmanagementRolesController } from './controllers/supportmanagement.roles.controller';
import { SupportmanagementLabelController } from '@controllers/supportmanagement.labels.controller';
import { SupportmanagementCategoriesController } from './controllers/supportmanagement.categories.controller';

validateEnv();

const app = new App([
  IndexController,
  UserController,
  SupportmanagementController,
  SupportmanagementLabelController,
  SupportmanagementRolesController,
  SupportmanagementCategoriesController,
]);

app.listen();
