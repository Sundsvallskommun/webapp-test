import ApiService from '@/services/api.service';
import { logger } from '@/utils/logger';
import { OpenAPI } from 'routing-controllers-openapi';
import { Controller, Get, Res, Param, QueryParam } from 'routing-controllers';
import { LabelsResponse } from '@/responses/supportmanagement.labels.response';

@Controller()
export class SupportmanagementLabelController {
  private apiService = new ApiService();
  private baseUrl = 'supportmanagement/6.1';

  @Get('/supportmanagement/municipality/:municipality/namespace/:namespace/labels')
  @OpenAPI({ summary: 'Returns a list of labels available for the provided municipalityId and namespace' })
  async getLabels(
    @Param('municipality') municipality: number,
    @Param('namespace') namespace: string
  ): Promise<LabelsResponse> {
    const url = this.baseUrl + `/${namespace}/${municipality}/metadata/labels`;

    return await this.apiService
      .get<LabelsResponse>({ url })
      .then(res => res.data)
      .catch(e => {
        logger.error('Error when retrieving Labels:', e);
        throw e;
      });
  }
}
