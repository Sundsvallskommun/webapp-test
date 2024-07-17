import ApiService from '@/services/api.service';
import { logger } from '@/utils/logger';
import { OpenAPI } from 'routing-controllers-openapi';
import { Controller, Get, Body, Post, Param, HttpCode } from 'routing-controllers';
import { RoleCreateRequest } from '@/requests/supportmanagement.roles.request';
import { RolesResponse, RoleResponse } from '@/responses/supportmanagement.roles.response';
import { BASE_URL_SUPPORTMANAGEMENT } from '@/config/service-endpoints';

@Controller()
export class SupportmanagementRolesController {
  private apiService = new ApiService();
  private baseUrl = BASE_URL_SUPPORTMANAGEMENT;
                   
  @Get('/supportmanagement/municipality/:municipality/namespace/:namespace/roles')
  @OpenAPI({ summary: 'Returns all roles defined within provided municipalityId and namespace' })
  async getRoles(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string
  ): Promise<RolesResponse> {

    const url = this.baseUrl + `/${namespace}/${municipality}/metadata/roles`;

    const res = await this.apiService.get<RolesResponse>({ url }).catch(e => {
      logger.error('Error when retrieving roles:', e);
      throw e;
    });

    return res.data;
  }

  @Get('/supportmanagement/municipality/:municipality/namespace/:namespace/roles/:role')
  @OpenAPI({ summary: 'Returns role matching the provided parameters (or null if no match is found)' })
  async getRole(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
    @Param('role') role: string
  ): Promise<RoleResponse> {

    const url = this.baseUrl + `/${namespace}/${municipality}/metadata/roles/${role}`;

    const res = await this.apiService.get<RoleResponse>({ url })
    .catch(e => {
      logger.error('Error when retrieving role:', e);
      throw e;
    });

    return res.data;
  }

  @Post('/supportmanagement/municipality/:municipality/namespace/:namespace/roles')
  @OpenAPI({ summary: 'Creates a role for the provided municipality and namespace' })
  @HttpCode(201)
  async createRole(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
    @Body() request: RoleCreateRequest): Promise<boolean> {

    const url = this.baseUrl + `/${namespace}/${municipality}/metadata/roles`;

    await this.apiService.post<undefined>({ url: url, data: request }).catch(e => {
      logger.error('Error when creating role:', e);
      throw e;
    });
    
    return true;
  }

};