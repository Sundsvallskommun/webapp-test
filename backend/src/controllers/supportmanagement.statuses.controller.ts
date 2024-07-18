import ApiService from '@/services/api.service';
import { logger } from '@/utils/logger';
import { OpenAPI } from 'routing-controllers-openapi';
import { Controller, Get, Body, Post, Param, HttpCode } from 'routing-controllers';
import { BASE_URL_SUPPORTMANAGEMENT } from '@/config/service-endpoints';
import { StatusCreateRequest } from '@/requests/supportmanagement.statuses.request';
import { StatusesResponse, StatusResponse } from '@/responses/supportmanagement.statuses.response';

@Controller()
export class SupportmanagementStatusesController {
  private apiService = new ApiService();
  private baseUrl = BASE_URL_SUPPORTMANAGEMENT;
                   
  @Get('/supportmanagement/municipality/:municipality/namespace/:namespace/statuses')
  @OpenAPI({ summary: 'Returns all statuses defined within provided municipalityId and namespace' })
  async getStatuses(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string
  ): Promise<StatusesResponse> {

    const url = this.baseUrl + `/${namespace}/${municipality}/metadata/statuses`;

    const res = await this.apiService.get<StatusesResponse>({ url }).catch(e => {
      logger.error('Error when retrieving statuses:', e);
      throw e;
    });

    return res.data;
  }

  @Get('/supportmanagement/municipality/:municipality/namespace/:namespace/statuses/:status')
  @OpenAPI({ summary: 'Returns status matching the provided parameters' })
  async getStatus(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
    @Param('status') status: string
  ): Promise<StatusResponse> {

    const url = this.baseUrl + `/${namespace}/${municipality}/metadata/statuses/${status}`;

    const res = await this.apiService.get<StatusResponse>({ url })
    .catch(e => {
      logger.error('Error when retrieving status:', e);
      throw e;
    });

    return res.data;
  }

  @Post('/supportmanagement/municipality/:municipality/namespace/:namespace/statuses')
  @OpenAPI({ summary: 'Creates a new status for the provided municipality and namespace' })
  @HttpCode(201)
  async createStatus(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
    @Body() request: StatusCreateRequest): Promise<boolean> {

    const url = this.baseUrl + `/${namespace}/${municipality}/metadata/statuses`;

    await this.apiService.post<undefined>({ url: url, data: request }).catch(e => {
      logger.error('Error when creating status:', e);
      throw e;
    });
    
    return true;
  }

};