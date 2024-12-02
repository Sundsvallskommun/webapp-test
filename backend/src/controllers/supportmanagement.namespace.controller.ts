import ApiService from '@/services/api.service';
import { logger } from '@/utils/logger';

import { OpenAPI } from 'routing-controllers-openapi';
import { Controller, Get, Body, Post, Put, Delete, Param, HttpCode } from 'routing-controllers';
import { NamespacesResponse, NamespaceResponse, MetadataResponse } from '@/responses/supportmanagement.namespace.response';
import { NamespaceCreateRequest, NamespaceUpdateRequest } from '@/requests/supportmanagement.namespace.request';
import { BASE_URL_SUPPORTMANAGEMENT } from '@/config/service-endpoints';

@Controller()
export class SupportmanagementNamespaceController {
  private apiService = new ApiService();
  private baseUrl = BASE_URL_SUPPORTMANAGEMENT;

  @Get('/supportmanagement/municipality/:municipality/namespaces')
  @OpenAPI({ summary: 'Returns a list of namespaces available for the provided municipalityId' })
  async getNamespaces(@Param('municipality') municipality: string): Promise<NamespacesResponse> {
    const url = this.baseUrl + `/namespace-configs?municipalityId=${municipality}`;

    const res = await this.apiService.get<NamespacesResponse>({ url }).catch(e => {
      logger.error('Error when retrieving namespace configurations:', e);
      throw e;
    });

    return res.data;
  }

  @Get('/supportmanagement/municipality/:municipality/namespaces/:namespace/is-metadata-present')
  @OpenAPI({ summary: 'Returns boolean if namespace matching the provided municipalityId and namespace has metadata present or not' })
  async isMetadataPresent(@Param('municipality') municipality: string, @Param('namespace') namespace: string): Promise<boolean> {
    const url = this.baseUrl + `/${municipality}/${namespace}/metadata`;

    const res = await this.apiService.get<MetadataResponse>({ url }).catch(e => {
      logger.error('Error when retrieving metadata for namespace:', e);
      throw e;
    });

    return (res.data.categories?.length) > 0 ||
      res.data.contactReasons?.length > 0 ||
      res.data.externalIdTypes?.length > 0 ||
      res.data.labels?.length > 0 ||
      res.data.roles?.length > 0 ||
      res.data.statuses?.length > 0
  }

  @Get('/supportmanagement/municipality/:municipality/namespaces/:namespace')
  @OpenAPI({ summary: 'Returns namespace matching the provided municipalityId and namespace' })
  async getNamespace(@Param('municipality') municipality: string, @Param('namespace') namespace: string): Promise<NamespaceResponse> {
    const url = this.baseUrl + `/${municipality}/${namespace}/namespace-config`;

    const res = await this.apiService.get<NamespaceResponse>({ url }).catch(e => {
      logger.error('Error when retrieving namespace configuration:', e);
      throw e;
    });

    return res.data;
  }

  @Post('/supportmanagement/municipality/:municipality/namespaces/:namespace')
  @OpenAPI({ summary: 'Creates a namespace for the provided municipality and provided parameters' })
  @HttpCode(201)
  async createNamespace(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
    @Body() request: NamespaceCreateRequest,
  ): Promise<boolean> {
    const url = this.baseUrl + `/${municipality}/${namespace}/namespace-config`;

    await this.apiService.post<undefined>({ url: url, data: request }).catch(e => {
      logger.error('Error when creating namespace configuration:', e);
      throw e;
    });

    return true;
  }

  @Put('/supportmanagement/municipality/:municipality/namespaces/:namespace')
  @OpenAPI({ summary: 'Updates a namespace for the provided municipality with the provided parameters' })
  @HttpCode(204)
  async updateNamespace(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
    @Body() request: NamespaceUpdateRequest,
  ): Promise<boolean> {
    const url = this.baseUrl + `/${municipality}/${namespace}/namespace-config`;

    await this.apiService.put<undefined>({ url: url, data: request }).catch(e => {
      logger.error('Error when creating namespace configuration:', e);
      throw e;
    });

    return true;
  }

  @Delete('/supportmanagement/municipality/:municipality/namespace/:namespace')
  @OpenAPI({ summary: 'Deletes a namespace from the provided municipality' })
  @HttpCode(204)
  async deleteNamespace(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
  ): Promise<boolean> {
    const url = this.baseUrl + `/${municipality}/${namespace}/namespace-config`;

    await this.apiService.delete({ url: url }).catch(e => {
      logger.error('Error when deleting namespace configuration:', e);
      throw e;
    });

    return true;
  }
}
