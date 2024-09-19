import App from '@/app';
import { IndexController } from '@controllers/index.controller';
import validateEnv from '@utils/validateEnv';
import { UserController } from './controllers/user.controller';
import { SupportmanagementMunicipalityController } from './controllers/supportmanagement.municipality.controller';
import { SupportmanagementNamespaceController } from './controllers/supportmanagement.namespace.controller';
import { SupportmanagementRolesController } from './controllers/supportmanagement.roles.controller';
import { SupportmanagementLabelController } from '@controllers/supportmanagement.labels.controller';
import { SupportmanagementCategoriesController } from './controllers/supportmanagement.categories.controller';
import { SupportmanagementContactreasonsController } from './controllers/supportmanagement.contactreasons.controller';
import { SupportmanagementStatusesController } from './controllers/supportmanagement.statuses.controller';
import { SupportmanagementEmailconfigurationController } from './controllers/supportmanagement.emailconfiguration.controller';
import { ActiveDirectoryController } from './controllers/active-directory-controller';

validateEnv();

const app = new App([
  IndexController,
  UserController,
  SupportmanagementMunicipalityController,
  SupportmanagementNamespaceController,
  SupportmanagementLabelController,
  SupportmanagementRolesController,
  SupportmanagementCategoriesController,
  SupportmanagementContactreasonsController,
  SupportmanagementStatusesController,
  SupportmanagementEmailconfigurationController,
  ActiveDirectoryController,
]);

app.listen();
