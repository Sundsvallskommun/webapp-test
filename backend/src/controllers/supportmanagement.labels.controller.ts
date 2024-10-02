import ApiService from '@/services/api.service';
import { logger } from '@/utils/logger';
import { OpenAPI } from 'routing-controllers-openapi';
import { Controller, Get, Res, Param, QueryParam } from 'routing-controllers';
import { LabelsResponse } from '@/responses/supportmanagement.labels.response';
import { BASE_URL_SUPPORTMANAGEMENT } from '@/config/service-endpoints';

@Controller()
export class SupportmanagementLabelController {
  private apiService = new ApiService();
  private baseUrl = BASE_URL_SUPPORTMANAGEMENT;

  @Get('/supportmanagement/municipality/:municipality/namespace/:namespace/labels')
  @OpenAPI({ summary: 'Returns a list of labels available for the provided municipalityId and namespace' })
  async getLabels(@Param('municipality') municipality: number, @Param('namespace') namespace: string): Promise<LabelsResponse> {
    const url = this.baseUrl + `/${municipality}/${namespace}/metadata/labels`;

    const response = await this.apiService
      .get<any>({ url })
      .then(res => res.data)
      .catch(e => {
        logger.error('Error when retrieving Labels:', e);
        throw e;
      });

    if (response.labelStructure) {
      response.labelStructure = response.labelStructure.sort((a, b) => a.displayName.localeCompare(b.displayName)); // Need to sort top level based on display name
	}
    return response;
  }
}
