import App from '@/app';
import { IndexController } from '@controllers/index.controller';
import validateEnv from '@utils/validateEnv';
import { UserController } from './controllers/user.controller';
import { SupportmanagementNamespaceController } from './controllers/supportmanagement.namespace.controller';
import { SupportmanagementRolesController } from './controllers/supportmanagement.roles.controller';
import { SupportmanagementLabelController } from '@controllers/supportmanagement.labels.controller';
import { SupportmanagementCategoriesController } from './controllers/supportmanagement.categories.controller';
import { SupportmanagementContactreasonsController } from './controllers/supportmanagement.contactreasons.controller';
import { SupportmanagementStatusesController } from './controllers/supportmanagement.statuses.controller';
import { SupportmanagementEmailconfigurationController } from './controllers/supportmanagement.emailconfiguration.controller';

validateEnv();

const app = new App([
  IndexController,
  UserController,
  SupportmanagementNamespaceController,
  SupportmanagementLabelController,
  SupportmanagementRolesController,
  SupportmanagementCategoriesController,
  SupportmanagementContactreasonsController,
  SupportmanagementStatusesController,
  SupportmanagementEmailconfigurationController,
]);

app.listen();
