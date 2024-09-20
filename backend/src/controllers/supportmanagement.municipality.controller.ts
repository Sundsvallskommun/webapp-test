import ApiService from '@/services/api.service';
import { logger } from '@/utils/logger';
import { municipalities } from '@/utils/municipalityUtil';

import { OpenAPI } from 'routing-controllers-openapi';
import { Controller, Get, Body, Post, Patch, Res, Param, HttpCode } from 'routing-controllers';
import { MunicipalitiesResponse, NamespacesResponse, NamespaceResponse, Namespace } from '@/responses/supportmanagement.namespace.response';
import { NamespaceCreateRequest, NamespaceUpdateRequest } from '@/requests/supportmanagement.namespace.request';
import { BASE_URL_SUPPORTMANAGEMENT } from '@/config/service-endpoints';

@Controller()
export class SupportmanagementMunicipalityController {
                   
  @Get('/supportmanagement/municipality')
  @OpenAPI({ summary: 'Returns a list of available municipalities' })
  async getMunicipalities(
  ): Promise<MunicipalitiesResponse> {

    return { 
      data: municipalities
        .filter(m => m.municipalityId.startsWith("22"))
        .sort((a, b) => a.name.localeCompare(b.name)),
      message: 'SUCCESS'
    };
  }
}
