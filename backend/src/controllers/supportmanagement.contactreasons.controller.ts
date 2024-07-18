import ApiService from '@/services/api.service';
import { logger } from '@/utils/logger';
import { OpenAPI } from 'routing-controllers-openapi';
import { Controller, Get, Body, Post, Param, HttpCode } from 'routing-controllers';
import { ContactreasonCreateRequest } from '@/requests/supportmanagement.contactreasons.request';
import { ContactreasonsResponse, ContactreasonResponse } from '@/responses/supportmanagement.contactreasons.response';
import { BASE_URL_SUPPORTMANAGEMENT } from '@/config/service-endpoints';

@Controller()
export class SupportmanagementContactreasonsController {
  private apiService = new ApiService();
  private baseUrl = BASE_URL_SUPPORTMANAGEMENT;
                   
  @Get('/supportmanagement/municipality/:municipality/namespace/:namespace/contactreasons')
  @OpenAPI({ summary: 'Returns all contactreasons defined within provided municipalityId and namespace' })
  async getContactreasons(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string
  ): Promise<ContactreasonsResponse> {

    const url = this.baseUrl + `/${namespace}/${municipality}/metadata/contactreasons`;

    const res = await this.apiService.get<ContactreasonsResponse>({ url }).catch(e => {
      logger.error('Error when retrieving contactreasons:', e);
      throw e;
    });

    return res.data;
  }

  @Get('/supportmanagement/municipality/:municipality/namespace/:namespace/contactreasons/:contactreason')
  @OpenAPI({ summary: 'Returns contactreason matching the provided parameters (or null if no match is found)' })
  async getContactreason(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
    @Param('contactreason') contactreason: string
  ): Promise<ContactreasonResponse> {

    const url = this.baseUrl + `/${namespace}/${municipality}/metadata/contactreasons/${contactreason}`;

    const res = await this.apiService.get<ContactreasonResponse>({ url })
    .catch(e => {
      logger.error('Error when retrieving contactreason:', e);
      throw e;
    });

    return res.data;
  }

  @Post('/supportmanagement/municipality/:municipality/namespace/:namespace/contactreasons')
  @OpenAPI({ summary: 'Creates a contactreason for the provided municipality and namespace' })
  @HttpCode(201)
  async createContactreason(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
    @Body() request: ContactreasonCreateRequest): Promise<boolean> {

    const url = this.baseUrl + `/${namespace}/${municipality}/metadata/contactreasons`;

    await this.apiService.post<undefined>({ url: url, data: request }).catch(e => {
      logger.error('Error when creating contactreason:', e);
      throw e;
    });
    
    return true;
  }

};