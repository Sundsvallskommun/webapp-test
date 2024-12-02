import ApiService from '@/services/api.service';
import { logger } from '@/utils/logger';
import { OpenAPI } from 'routing-controllers-openapi';
import { Controller, Get, Body, Post, Patch, Delete, Param, HttpCode } from 'routing-controllers';
import { ContactreasonCreateRequest, ContactreasonUpdateRequest } from '@/requests/supportmanagement.contactreasons.request';
import { ContactreasonsResponse } from '@/responses/supportmanagement.contactreasons.response';
import { BASE_URL_SUPPORTMANAGEMENT } from '@/config/service-endpoints';

@Controller()
export class SupportmanagementContactreasonsController {
  private apiService = new ApiService();
  private baseUrl = BASE_URL_SUPPORTMANAGEMENT;

  @Get('/supportmanagement/municipality/:municipality/namespace/:namespace/contactreasons')
  @OpenAPI({ summary: 'Returns all contactreasons defined within provided municipalityId and namespace' })
  async getContactreasons(@Param('municipality') municipality: string, @Param('namespace') namespace: string): Promise<ContactreasonsResponse> {
    const url = this.baseUrl + `/${municipality}/${namespace}/metadata/contactreasons`;

    const res = await this.apiService.get<ContactreasonsResponse>({ url }).catch(e => {
      logger.error('Error when retrieving contactreasons:', e);
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
    @Body() request: ContactreasonCreateRequest,
  ): Promise<boolean> {
    const url = this.baseUrl + `/${municipality}/${namespace}/metadata/contactreasons`;

    await this.apiService.post<undefined>({ url: url, data: request }).catch(e => {
      logger.error('Error when creating contactreason:', e);
      throw e;
    });

    return true;
  }

  @Patch('/supportmanagement/municipality/:municipality/namespace/:namespace/contactreasons/:id')
  @OpenAPI({ summary: 'Updates a contactreason for the provided municipality, namespace and id' })
  @HttpCode(201)
  async updateContactreason(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
    @Param('id') id: number,
    @Body() request: ContactreasonUpdateRequest,
  ): Promise<boolean> {
    const url = this.baseUrl + `/${municipality}/${namespace}/metadata/contactreasons/${id}`;

    await this.apiService.patch<undefined>({ url: url, data: request }).catch(e => {
      logger.error('Error when updating contactreason:', e);
      throw e;
    });

    return true;
  }

  @Delete('/supportmanagement/municipality/:municipality/namespace/:namespace/contactreasons/:id')
  @OpenAPI({ summary: 'Deletes a contactreason from the provided municipality and namespace' })
  @HttpCode(204)
  async deleteRole(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
    @Param('id') id: number,
  ): Promise<boolean> {
    const url = this.baseUrl + `/${municipality}/${namespace}/metadata/contactreasons/${id}`;

    await this.apiService.delete({ url: url }).catch(e => {
      logger.error('Error when deleting contact reason:', e);
      throw e;
    });

    return true;
  }

}
