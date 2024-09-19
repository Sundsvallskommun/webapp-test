import { RequestWithUser } from '@/interfaces/auth.interface';
import ApiService from '@/services/api.service';
import authMiddleware from '@middlewares/auth.middleware';
import { Controller, Get, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { BASE_URL_ACTIVEDIRECTORY } from '@/config/service-endpoints';

export interface AdUser {
  description?: string;
  displayName: string;
  domain?: string;
  guid?: string;
  isLinked?: string;
  name: string;
  ouPath?: string;
  personId?: string;
  schemaClassName?: string;
}

@Controller()
export class ActiveDirectoryController {
  private apiService = new ApiService();
  private baseUrl = BASE_URL_ACTIVEDIRECTORY;

  @Get('/users/admins')
  @OpenAPI({ summary: 'Return all users in configured admin group' })
  @UseBefore(authMiddleware)
  async usersInAdminGroup(@Req() req: RequestWithUser, @Res() response: any): Promise<AdUser[]> {
    const domain = 'personal';
    const url = this.baseUrl + `/groupmembers/${domain}/${process.env.ADMIN_GROUP}`;
    const res = await this.apiService.get<AdUser[]>({ url });
    return response.status(200).send(res.data.map(u => ({ displayName: u.displayName, name: u.name, guid: u.guid })));
  }

  @Get('/users/viewers')
  @OpenAPI({ summary: 'Return all users in configured view group' })
  @UseBefore(authMiddleware)
  async usersInViewGroup(@Req() req: RequestWithUser, @Res() response: any): Promise<AdUser[]> {
    const domain = 'personal';
    const url = this.baseUrl + `/groupmembers/${domain}/${process.env.ViEW_GROUP}`;
    const res = await this.apiService.get<AdUser[]>({ url });
    return response.status(200).send(res.data.map(u => ({ displayName: u.displayName, name: u.name, guid: u.guid })));
  }
}