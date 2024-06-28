import ApiService from '@/services/api.service';
import { logger } from '@/utils/logger';
import { OpenAPI } from 'routing-controllers-openapi';
import { Controller, Get, Res, Param, QueryParam } from 'routing-controllers';
import { MunicipalitiesResponse, NamespacesResponse } from '@/responses/supportmanagement.response';

@Controller()
export class SupportmanagementController {
  private apiService = new ApiService();
  private baseUrl = 'supportmanagement/6.1/';

  @Get('/supportmanagement/municipality')
  @OpenAPI({ summary: 'Returns a list of available municipalities' })
  async getMunicipalities(
  ): Promise<MunicipalitiesResponse> {
    const url =
      this.baseUrl + '/muncipality';

    /*
    const res = await this.apiService.get<MunicipalitiesApiResponse>({ url }).catch(e => {
      logger.error('Error when retrieving municipalities:', e);
      throw e;
    });
    
    return res.data;
    */

    return {data: [{municipalityId: 2281, name: 'Sundsvalls kommun'},
                   {municipalityId: 2262, name: 'Timrå kommun'},
                   {municipalityId: 2260, name: 'Ånge kommun'}],
            message: 'SUCCESS'} as MunicipalitiesResponse;
  }


  @Get('/supportmanagement/:municipality/namespace')
  @OpenAPI({ summary: 'Returns a list of namespaces available for the provided municipalityId' })
  async getNamespaces(
    @Param('municipality') municipality: number
  ): Promise<NamespacesResponse> {

    const url = this.baseUrl + `municipality/${municipality}/namespace`;

    /*
    const res = await this.apiService.get<MunicipalitiesApiResponse>({ url }).catch(e => {
      logger.error('Error when retrieving municipalities:', e);
      throw e;
    });
    
    return res.data;
    */

    if (municipality === 2281) {
    return {data: [{namespace: 'CONTACTCENTER', displayname: 'Kontaktcenter', description: 'Namnutrymme för kontaktcenter', shortCode:'KC', created:'2024-06-10 15:43:55.911', modified:'2024-06-12 08:35:34.112'},
                   {namespace: 'CONTACTSUNDSVALL', displayname: 'Kontakt Sundsvall', description: 'Namnutrymme för kontakt Sundsvall', shortCode:'KS', created:'2024-06-10 15:43:55.911'},
                   {namespace: 'SALARYANDPENSION', displayname: 'Lön & Pension', shortCode:'LoP', description: 'Namnutrymme till systemet för lön och pension', created:'2024-06-15 11:12:35.314'}],
            message: 'SUCCESS'} as NamespacesResponse;
	} else if (municipality === 2262) {
    return {data: [{namespace: 'CONTACTCENTER', displayname: 'Kontaktcenter', description: 'Namnutrymme för kontaktcenter', shortCode:'KC', created:'2024-06-10 15:43:55.911', modified:'2024-06-12 08:35:34.112'},
                   {namespace: 'SALARYANDPENSION', displayname: 'Lön & Pension', shortCode:'LoP', description: 'Namnutrymme till systemet för lön och pension', created:'2024-06-15 11:12:35.314'}],
            message: 'SUCCESS'} as NamespacesResponse;
	} else {
    return {data: [],
            message: 'SUCCESS'} as NamespacesResponse;
	}
  }
}
