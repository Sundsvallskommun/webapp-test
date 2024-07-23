import ApiService from '@/services/api.service';
import { logger } from '@/utils/logger';

import { OpenAPI } from 'routing-controllers-openapi';
import { Controller, Get, Body, Post, Put, Param, HttpCode } from 'routing-controllers';
import { EmailConfigurationCreateRequest, EmailConfigurationUpdateRequest } from '@/requests/supportmanagement.emailconfiguration.request';
import { EmailConfigurationResponse } from '@/responses/supportmanagement.emailconfiguration.response';
import { BASE_URL_SUPPORTMANAGEMENT } from '@/config/service-endpoints';

@Controller()
export class SupportmanagementEmailconfigurationController {
  private apiService = new ApiService();
  private baseUrl = BASE_URL_SUPPORTMANAGEMENT;
                   
  @Get('/supportmanagement/municipality/:municipality/namespace/:namespace/emailconfiguration')
  @OpenAPI({ summary: 'Returns the email integration configuration defined within provided municipalityId and namespace' })
  async getEmailConfiguration(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string
  ): Promise<EmailConfigurationResponse> {

    const url = this.baseUrl + `/${namespace}/${municipality}/emailIntegrationConfig`;

    const res = await this.apiService.get<EmailConfigurationResponse>({ url }).catch(e => {
      logger.error('Error when retrieving email configuration:', e);
      throw e;
    });

    return res.data;
  }

  @Post('/supportmanagement/municipality/:municipality/namespace/:namespace/emailconfiguration')
  @OpenAPI({ summary: 'Creates an email integration configuration for the provided municipality and namespace' })
  @HttpCode(201)
  async createEmailConfiguration(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
    @Body() request: EmailConfigurationCreateRequest): Promise<boolean> {

    const url = this.baseUrl + `/${namespace}/${municipality}/emailIntegrationConfig`;

    await this.apiService.post<undefined>({ url: url, data: request }).catch(e => {
      logger.error('Error when creating email configuration:', e);
      throw e;
    });
    
    return true;
  }


  @Put('/supportmanagement/municipality/:municipality/namespace/:namespace/emailconfiguration')
  @OpenAPI({ summary: 'Replaces existing (or creates new if non existing) email integration configuration matching the provided municipality and namespace' })
  @HttpCode(201)
  async replaceEmailConfiguration(
    @Param('municipality') municipality: string,
    @Param('namespace') namespace: string,
    @Body() request: EmailConfigurationUpdateRequest): Promise<boolean> {

    const url = this.baseUrl + `/${namespace}/${municipality}/emailIntegrationConfig`;

    await this.apiService.put<undefined>({ url: url, data: request }).catch(e => {
      logger.error('Error when replacing email configuration:', e);
      throw e;
    });
    
    return true;
  }

};