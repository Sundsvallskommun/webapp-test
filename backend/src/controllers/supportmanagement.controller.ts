import ApiService from '@/services/api.service';
import { logger } from '@/utils/logger';
import { municipalities } from '@/utils/municipalityUtil';

import { OpenAPI } from 'routing-controllers-openapi';
import { Controller, Get, Body, Post, Patch, Res, Param, HttpCode } from 'routing-controllers';
import { MunicipalitiesResponse, NamespacesResponse, NamespaceResponse, Namespace } from '@/responses/supportmanagement.response';
import { NamespaceCreateRequest, NamespaceUpdateRequest } from '@/requests/supportmanagement.request';
import { BASE_URL_SUPPORTMANAGEMENT } from '@/config/service-endpoints';

@Controller()
export class SupportmanagementController {
  private apiService = new ApiService();
  private baseUrl = BASE_URL_SUPPORTMANAGEMENT;
                   
  private namespaces = [
    {"key": "2281", "value": [
      {namespace: 'CONTACTCENTER', displayname: 'Kontaktcenter', description: 'Namnutrymme för kontaktcenter', shortCode:'KC', created:'2024-06-10 15:43:55.911', modified:'2024-06-12 08:35:34.112'},
      {namespace: 'CONTACTSUNDSVALL', displayname: 'Kontakt Sundsvall', description: 'Namnutrymme för kontakt Sundsvall', shortCode:'KS', created:'2024-06-10 15:43:55.911'},
      {namespace: 'SALARYANDPENSION', displayname: 'Lön & Pension', shortCode:'LoP', description: 'Namnutrymme till systemet för lön och pension', created:'2024-06-15 11:12:35.314'}]},
    {"key": "2262", "value": [
      {namespace: 'SALARYANDPENSION', displayname: 'Lön & Pension', shortCode:'LoP', description: 'Namnutrymme till systemet för lön och pension', created:'2024-06-15 11:12:35.314'},
      {namespace: 'CONTACTCENTER', displayname: 'Kontaktcenter', description: 'Namnutrymme för kontaktcenter', shortCode:'KC', created:'2024-06-10 15:43:55.911', modified:'2024-06-12 08:35:34.112'}]
    }
  ];
  
  @Get('/supportmanagement/municipality')
  @OpenAPI({ summary: 'Returns a list of available municipalities' })
  async getMunicipalities(
  ): Promise<MunicipalitiesResponse> {
	const url =
	  this.baseUrl + '/muncipality';

    /*
    const res = await this.apiService.get<MunicipalitiesResponse>({ url }).catch(e => {
      logger.error('Error when retrieving municipalities:', e);
      throw e;
    });
    
    return res.data;
    */

    return { 
      data: municipalities
        .filter(m => m.municipalityId.startsWith("22"))
        .sort((a, b) => a.name.localeCompare(b.name)),
      message: 'SUCCESS'
    };
  }


  @Get('/supportmanagement/municipality/:municipality/namespace')
  @OpenAPI({ summary: 'Returns a list of namespaces available for the provided municipalityId' })
  async getNamespaces(
    @Param('municipality') municipality: string
  ): Promise<NamespacesResponse> {

	const url = this.baseUrl + `municipality/${municipality}/namespace`;

    /*
    const res = await this.apiService.get<NamespacesResponse>({ url }).catch(e => {
      logger.error('Error when retrieving municipalities:', e);
      throw e;
    });
    
    return res.data;
    */
    const unsorted = this.namespaces.find(m => m.key === municipality)?.value || [] as Namespace[];

    return {
      data: unsorted.sort((a,b) => a.displayname.localeCompare(b.displayname)),
      message: 'SUCCESS}'
    };
  }

  @Get('/supportmanagement/municipality/:municipality/namespace/:namespace')
  @OpenAPI({ summary: 'Returns namespace matching the provided municipalityId and namespace' })
  async getNamespace(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string
  ): Promise<NamespaceResponse> {

    const url = this.baseUrl + `municipality/${municipality}/namespace/${namespace}`;

    /*
    const res = await this.apiService.get<NamespacesResponse>({ url }).catch(e => {
      logger.error('Error when retrieving municipalities:', e);
      throw e;
    });
    
    return res.data;
    */

    const candidates = this.namespaces.find(m => m.key === municipality)?.value || [];

    return {
      data: candidates.find(m => m.namespace === namespace) || null,
      message: 'SUCCESS'
    };
  }

  @Get('/supportmanagement/municipality/:municipality/shortcode/:shortcode')
  @OpenAPI({ summary: 'Returns flag if provided shortcode is available or not within the provided municipality' })
  async isShortCodeAvailable(
    @Param('municipality') municipality: string,
    @Param('shortcode') shortCode: string
  ): Promise<boolean> {

    const url = this.baseUrl + `municipality/${municipality}/namespace?shortCode=${shortCode}`;

    /*
    const res = await this.apiService.get<NamespacesResponse>({ url }).catch(e => {
      logger.error('Error when retrieving municipalities:', e);
      throw e;
    });
    
    return res.data;
    */

    const candidates = this.namespaces.find(m => m.key === municipality)?.value || [];
    const existingShortCode = candidates.find(m => m.shortCode === shortCode)?.shortCode || null;

    return existingShortCode === null;
  }

  @Post('/supportmanagement/municipality/:municipality/namespace')
  @OpenAPI({ summary: 'Creates a namespace for the provided municipality and provided parameters' })
  @HttpCode(201)
  async createNamespace(
    @Param('municipality') municipality: string,
    @Body() request: NamespaceCreateRequest): Promise<boolean> {

    const parent = this.namespaces.find(m => m.key === municipality) || null;
    const child = {
      namespace: request.namespace ,
      displayname: request.displayname,
      description: request.description,
      shortCode:request.shortCode,
      created: new Date().toISOString()
    };

    if (parent) {
      parent.value.push(child);
    } else {
      this.namespaces.push({"key": municipality, "value": [child]})
    }

    return true;
  }

  @Patch('/supportmanagement/municipality/:municipality/namespace/:namespace')
  @OpenAPI({ summary: 'Updates a namespace for the provided municipality with the provided parameters' })
  async updateNamespace(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
    @Body() request: NamespaceUpdateRequest): Promise<boolean> {

    const parent = this.namespaces.find(m => m.key === municipality) || null;
    const currentChild = parent?.value.find(m => m.namespace === namespace) || null;

    if (currentChild) {
      const updatedChild = {
        ...currentChild,
        displayname: request.displayname,
        description: request.description,
        updated: new Date().toISOString()
      }
      Object.assign(currentChild, updatedChild);
    }

    return true;
  }
}
